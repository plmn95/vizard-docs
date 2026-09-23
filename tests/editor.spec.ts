import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { splitDocument, equivalent, preserveSource } from '../src/lib/suggestions/document.mjs';

test('every documentation page survives Milkdown import/export and an edit without losing content', async ({ page }) => {
  await page.goto('edit/concepts/signal-chain/');
  await expect(page.getByRole('textbox', {name: 'Page content'})).toBeVisible();
  const files = readdirSync('src/content/docs', {recursive: true}).filter(file => String(file).endsWith('.md'));
  const failures: string[] = [];
  for (const file of files) {
    const body = splitDocument(readFileSync(`src/content/docs/${file}`, 'utf8')).body;
    const result = await page.evaluate(async (body) => {
      const { createDocumentEditor, editorViewCtx } = await import('/src/lib/suggestions/editor.ts');
      const root = document.createElement('div'); document.body.append(root);
      let editor;
      try {
        editor = await createDocumentEditor(root, body);
        const before = editor.getMarkdown();
        editor.editor.action(ctx => { const view = ctx.get(editorViewCtx); view.dispatch(view.state.tr.insertText('Corpus check: ', 1)); });
        return { before, after: editor.getMarkdown() };
      } catch(error) { return { error: String(error) }; }
      finally { if(editor) await editor.destroy(); root.remove(); }
    }, body);
    if (result.error) { failures.push(`${file}: ${result.error}`); continue; }
    if (!equivalent(body, result.before)) { failures.push(`${file}: semantic mismatch`); continue; }
    try {
    expect(preserveSource(body, result.before), String(file)).toBe(body);
    const patched = preserveSource(body, result.after);
    expect(equivalent(patched, result.after), String(file)).toBe(true);
    expect(patched).toContain('Corpus check: ');
    } catch(error) { failures.push(`${file}: ${error}`); }
  }
  expect(failures).toEqual([]);
  console.log(`Milkdown corpus: ${files.length} pages, exact no-op preservation and edited semantic preservation.`);
});

async function mockChallenge(page: any) {
  await page.route('https://challenges.cloudflare.com/**', route => route.fulfill({contentType:'application/javascript', body:
    'window.turnstile={render:(el,o)=>{window.testChallenge=o;setTimeout(()=>o.callback("test-token"),0);el.textContent="Spam check passed (test)";return "test"},reset:()=>window.testChallenge.callback("test-token")};'}));
}

test('reader edits multiple sections, restores draft, reviews, retries once and receives one receipt', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({width:1440,height:1000}); await mockChallenge(page);
  const payloads: any[] = [];
  await page.route('http://127.0.0.1:8787/suggestions', route => {
    payloads.push(route.request().postDataJSON());
    return route.fulfill({status: payloads.length === 1 ? 503 : 202, contentType:'application/json',
      headers:{'Access-Control-Allow-Origin':'*'}, body: JSON.stringify(payloads.length === 1 ? {error:'Temporary service outage.'} : {id:payloads[0].id})});
  });
  await page.goto('concepts/signal-chain/?manual=v0.14.0');
  await expect(page).toHaveTitle('Signal Chain | Vizard Documentation');
  await expect(page.locator('.suggestion-pick')).toHaveCount(0);
  await page.getByRole('link',{name:'Edit this page'}).first().click();
  const content = page.getByRole('textbox',{name:'Page content'});
  await expect(content).toBeVisible();
  await page.screenshot({path:'/tmp/vizard-full-page-editor-desktop.png'});
  await page.getByRole('button',{name:'Review changes',exact:true}).click();
  await expect(page.locator('[data-message]')).toContainText('Make a change');
  await content.press('ControlOrMeta+Home'); await page.keyboard.insertText('Updated: ');
  await content.press('ControlOrMeta+End'); await page.keyboard.press('Enter'); await page.keyboard.insertText('A useful additional explanation.');
  await expect(page.locator('[data-draft-status]')).toContainText('Draft saved');
  await page.reload(); await expect(content).toContainText('Updated:'); await expect(content).toContainText('A useful additional explanation.');
  await page.getByRole('button',{name:'Review changes',exact:true}).click();
  await expect(page.locator('[data-diff]')).toContainText('Updated:');
  await expect(page.locator('[data-diff]')).not.toContainText('Every module carries');
  await page.locator('#explanation').fill('Clarify two parts of the page.');
  await page.getByRole('button',{name:'Send suggestion',exact:true}).click();
  await expect(page.locator('[data-message]')).toContainText('Your draft has been kept');
  await page.getByRole('button',{name:'Send suggestion',exact:true}).click();
  await expect(page.getByRole('link',{name:'Check suggestion status'})).toBeVisible();
  expect(payloads).toHaveLength(2); expect(payloads[0].id).toBe(payloads[1].id);
  expect(payloads[0].kind).toBe('page'); expect(payloads[0].version).toBe('v0.14.0'); expect(payloads[0].replacement).toContain('`Chain`');
  expect(payloads[0].replacement).toContain('A useful additional explanation.');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(k=>k.startsWith('vizard-page-draft:')))).toHaveLength(0);
  expect(errors).toEqual([]);
});

test('mobile tables stay usable and cell edits preserve the rest of the document', async ({page}) => {
  await page.setViewportSize({width:390,height:844}); await mockChallenge(page);
  await page.goto('edit/reference/insert-fx-region/');
  const content = page.getByRole('textbox',{name:'Page content'}); await expect(content).toBeVisible();
  const cell = content.locator('td').first();
  await expect(cell).toContainText('Enable Region');
  await cell.click(); await page.keyboard.press('Home'); await page.keyboard.insertText('Updated ');
  await expect(cell).toContainText('Updated');
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:'/tmp/vizard-full-page-editor-mobile.png'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Review changes',exact:true}).click();
  await expect(page.locator('[data-diff]')).toContainText('Updated');
  await expect(page.locator('[data-diff]')).not.toContainText('An optional soft-edged');
  await page.screenshot({path:'/tmp/vizard-full-page-editor-review-mobile.png'});
});

test('problem reports work independently of the visual editor', async ({page}) => {
  await mockChallenge(page); let payload: any;
  await page.route('http://127.0.0.1:8787/suggestions', route => {payload=route.request().postDataJSON();return route.fulfill({status:202,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify({id:payload.id})});});
  await page.goto('edit/concepts/signal-chain/?mode=problem');
  await page.locator('#problem').fill('Please explain the difference between BYP and MUTE.');
  await page.getByRole('button',{name:'Review changes',exact:true}).click();
  await page.getByRole('button',{name:'Send suggestion',exact:true}).click();
  await expect(page.getByRole('link',{name:'Check suggestion status'})).toBeVisible();
  expect(payload.kind).toBe('problem'); expect(payload.replacement).toBe('');
});

 test('toolbar controls have names and respond to the keyboard', async ({page}) => {
  await page.goto('edit/concepts/signal-chain/');
  await expect(page.getByRole('textbox',{name:'Page content'})).toBeVisible();
  const bold=page.getByRole('button',{name:'Bold',exact:true});
  await bold.focus(); await bold.press('Enter');
  await expect(bold).toHaveClass(/active/);
  await page.getByRole('button',{name:'Undo',exact:true}).focus();
  await expect(page.getByRole('button',{name:'Insert table',exact:true})).toBeVisible();
 });
