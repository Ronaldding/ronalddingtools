
function HomePage() {

  return (
    <div className="min-h-screen flex flex-col">
        {/* 导航栏 */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-xl font-bold text-primary">
              <span className="text-dark">Simple</span>App
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-dark hover:text-primary transition-colors">首页</a>
              <a href="#features" className="text-dark hover:text-primary transition-colors">特性</a>
              <a href="#about" className="text-dark hover:text-primary transition-colors">关于</a>
              <a href="#contact" className="text-dark hover:text-primary transition-colors">联系</a>
            </nav>
            <button className="md:hidden text-dark text-xl">
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-grow">
                {/* 英雄区域 */}
                <section id="home" className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
                  <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-dark mb-4">
                          打造<span className="text-primary">现代</span>网站体验
                        </h1>
                        <p className="text-muted mb-8 text-lg">
                          简单、高效、美观的React网站解决方案，让您的创意变为现实。
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <a href="#features" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-primary/20">
                            了解更多 <i className="fa-solid fa-arrow-right ml-2"></i>
                          </a>
                          <a href="#contact" className="bg-white border border-gray-200 text-dark hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-all">
                            联系我们
                          </a>
                        </div>
                      </div>
                      <div className="md:w-1/2 flex justify-center">
                        <img src="https://picsum.photos/600/400?random=1" alt="现代网站设计" className="rounded-xl shadow-xl max-w-full h-auto" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* 特性区域 */}
                <section id="features" className="py-20 bg-white">
                  <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                      <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-dark mb-4">
                        产品<span className="text-primary">特性</span>
                      </h2>
                      <p className="text-muted max-w-2xl mx-auto">
                        我们提供的解决方案具有多种强大特性，帮助您创建出色的网站体验。
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* 特性卡片 1 */}
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                          <i className="fa-solid fa-bolt text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-3">高性能</h3>
                        <p className="text-muted">
                          优化的代码结构和懒加载技术，确保您的网站加载速度快如闪电。
                        </p>
                      </div>

                      {/* 特性卡片 2 */}
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                          <i className="fa-solid fa-mobile-screen text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-3">响应式设计</h3>
                        <p className="text-muted">
                          您的网站在任何设备上都能完美展示，从手机到桌面电脑。
                        </p>
                      </div>

                      {/* 特性卡片 3 */}
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                          <i className="fa-solid fa-paintbrush text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-3">精美UI</h3>
                        <p className="text-muted">
                          现代、美观的界面设计，让您的网站在竞争中脱颖而出。
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 关于区域 */}
                <section id="about" className="py-20 bg-gray-50">
                  <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                      <div className="md:w-1/2">
                        <img src="https://picsum.photos/600/500?random=2" alt="关于我们" className="rounded-xl shadow-lg max-w-full h-auto" />
                      </div>
                      <div className="md:w-1/2">
                        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-dark mb-6">
                          关于<span className="text-primary">我们</span>
                        </h2>
                        <p className="text-muted mb-6">
                          我们是一支充满激情的开发团队，致力于创建高质量的Web解决方案。我们拥有多年的前端开发经验，专注于React和Tailwind CSS技术栈。
                        </p>
                        <p className="text-muted mb-8">
                          我们相信，通过创新和技术，我们可以帮助企业和个人实现他们的在线愿景。无论是简单的单页网站还是复杂的Web应用，我们都能提供量身定制的解决方案。
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                            <span>专业团队</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                            <span>高质量代码</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                            <span>按时交付</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                            <span>客户满意</span>
                          </div>
                        </div>
                        <a href="#contact" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-primary/20 inline-block">
                          联系我们 <i className="fa-solid fa-arrow-right ml-2"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 联系区域 */}
                <section id="contact" className="py-20 bg-white">
                  <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                      <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-dark mb-4">
                        联系<span className="text-primary">我们</span>
                      </h2>
                      <p className="text-muted max-w-2xl mx-auto">
                        有任何问题或需求？请填写下方表单，我们将尽快与您联系。
                      </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">姓名</label>
                            <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="您的姓名" />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">邮箱</label>
                            <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="您的邮箱" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-muted mb-1">主题</label>
                          <input type="text" id="subject" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="消息主题" />
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-muted mb-1">消息</label>
                          <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="请输入您的消息..."></textarea>
                        </div>
                        <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-primary/20 w-full">
                          发送消息 <i className="fa-solid fa-paper-plane ml-2"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                </section>
        </main>

        {/* 页脚 */}
        <footer className="bg-dark text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="text-xl font-bold mb-2">
                  <span className="text-primary">Simple</span>App
                </div>
                <p className="text-white/70">
                  打造现代网站体验的最佳选择
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <i className="fa-brands fa-github text-xl"></i>
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <i className="fa-brands fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <i className="fa-brands fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <i className="fa-brands fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
              &copy; 2025 SimpleApp. 保留所有权利.
            </div>
          </div>
        </footer>
      </div>
  );
}

export default HomePage;  