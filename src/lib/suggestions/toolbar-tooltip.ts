export function installToolbarTooltip(root: HTMLElement, toolbar: HTMLElement) {
  const events = new AbortController();
  const tooltip = document.createElement('div');
  tooltip.className = 'editor-toolbar-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  root.append(tooltip);

  let active: HTMLButtonElement | null = null;
  let dismissed: HTMLButtonElement | null = null;
  let showTimer: number | undefined;
  let hideTimer: number | undefined;

  const clearTimers = () => {
    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);
  };
  const hide = () => {
    clearTimers();
    tooltip.hidden = true;
    active = null;
  };
  const buttonFrom = (target: EventTarget | null) => {
    const button = target instanceof Element ? target.closest<HTMLButtonElement>('.top-bar-item') : null;
    return button && toolbar.contains(button) ? button : null;
  };
  const position = () => {
    if (!active || tooltip.hidden) return;
    const button = active.getBoundingClientRect();
    const tip = tooltip.getBoundingClientRect();
    const top = button.bottom + tip.height + 8 <= innerHeight ? button.bottom + 8 : button.top - tip.height - 8;
    tooltip.style.top = `${Math.max(8, top)}px`;
    tooltip.style.left = `${Math.max(8, Math.min(button.left + button.width / 2 - tip.width / 2, innerWidth - tip.width - 8))}px`;
  };
  const show = (button: HTMLButtonElement) => {
    if (dismissed === button) return;
    const label = button.querySelector('.sr-only')?.textContent?.trim();
    if (!label) return;
    clearTimers();
    active = button;
    tooltip.textContent = label;
    tooltip.hidden = false;
    position();
  };
  toolbar.addEventListener('pointerover', event => {
    const button = buttonFrom(event.target);
    if (!button || button.contains(event.relatedTarget as Node)) return;
    if (active && active !== button) hide();
    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);
    showTimer = window.setTimeout(() => show(button), 300);
  }, { signal: events.signal });
  toolbar.addEventListener('pointerout', event => {
    const button = buttonFrom(event.target);
    if (!button || button.contains(event.relatedTarget as Node)) return;
    if (dismissed === button) dismissed = null;
    window.clearTimeout(showTimer);
    if (active === button && !tooltip.contains(event.relatedTarget as Node) && !button.matches(':focus')) {
      hideTimer = window.setTimeout(hide, 120);
    }
  }, { signal: events.signal });
  toolbar.addEventListener('focusin', event => {
    const button = buttonFrom(event.target);
    if (button) show(button);
  }, { signal: events.signal });
  toolbar.addEventListener('focusout', event => {
    const button = buttonFrom(event.target);
    if (dismissed === button) dismissed = null;
    if (active === button && !button?.matches(':hover')) hide();
  }, { signal: events.signal });
  toolbar.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      dismissed = active;
      hide();
      event.stopPropagation();
    }
  }, { signal: events.signal });
  tooltip.addEventListener('pointerenter', () => window.clearTimeout(hideTimer), { signal: events.signal });
  tooltip.addEventListener('pointerleave', () => {
    if (!active?.matches(':hover') && !active?.matches(':focus')) hide();
  }, { signal: events.signal });
  window.addEventListener('scroll', position, { capture: true, signal: events.signal });
  window.addEventListener('resize', position, { signal: events.signal });
  return () => { events.abort(); hide(); tooltip.remove(); };
}
