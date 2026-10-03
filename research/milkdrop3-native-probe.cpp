#include "renderer/milk_runtime.h"
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <fstream>
#include <iostream>
int main(int argc,char**argv){
 if(argc!=4)return 2; if(!glfwInit())return 3;
 glfwWindowHint(GLFW_VISIBLE,GLFW_FALSE);glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR,4);glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR,1);glfwWindowHint(GLFW_OPENGL_PROFILE,GLFW_OPENGL_CORE_PROFILE);glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT,1);
 auto*w=glfwCreateWindow(600,580,"Hex diagnostic",nullptr,nullptr);if(!w)return 4;glfwMakeContextCurrent(w);if(!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))return 5;
 GLuint tex,fbo;glGenTextures(1,&tex);glBindTexture(GL_TEXTURE_2D,tex);glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA8,600,580,0,GL_RGBA,GL_UNSIGNED_BYTE,nullptr);glGenFramebuffers(1,&fbo);glBindFramebuffer(GL_FRAMEBUFFER,fbo);glFramebufferTexture2D(GL_FRAMEBUFFER,GL_COLOR_ATTACHMENT0,GL_TEXTURE_2D,tex,0);glDisable(GL_BLEND);glClearColor(0,0,0,0);glClear(GL_COLOR_BUFFER_BIT);
 { MilkDropRuntime runtime;std::string error;auto preset=importMilkPreset(argv[1]);if(!runtime.load(preset,600,580,error)){std::cerr<<error<<"\n";return 6;}
 for(int i=0;i<std::stoi(argv[3]);i++)runtime.render(fbo,600,580,1.f/60,nullptr,0);
 glBindFramebuffer(GL_FRAMEBUFFER,fbo);glPixelStorei(GL_PACK_ALIGNMENT,1);std::vector<unsigned char>buf(600*580*3);glReadPixels(0,0,600,580,GL_RGB,GL_UNSIGNED_BYTE,buf.data());std::ofstream out(argv[2],std::ios::binary);out<<"P6\n600 580\n255\n";for(int y=579;y>=0;y--)out.write((char*)buf.data()+y*600*3,600*3);std::cout<<"Rendered "<<argv[1]<<"; GL error "<<glGetError()<<"\n";
 }
 glfwDestroyWindow(w);glfwTerminate();return 0;
}
