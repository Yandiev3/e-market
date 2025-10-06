// components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Магазин</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">О нас</Link></li>
              <li><Link href="/contacts" className="hover:text-foreground transition-colors">Контакты</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Вакансии</Link></li>
              <li><Link href="/stores" className="hover:text-foreground transition-colors">Магазины</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Помощь</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/delivery" className="hover:text-foreground transition-colors">Доставка</Link></li>
              <li><Link href="/returns" className="hover:text-foreground transition-colors">Возврат</Link></li>
              <li><Link href="/sizes" className="hover:text-foreground transition-colors">Размеры</Link></li>
              <li><Link href="/care" className="hover:text-foreground transition-colors">Уход за обувью</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Правовая информация</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Условия использования</Link></li>
              <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie-файлы</Link></li>
              <li><Link href="/legal" className="hover:text-foreground transition-colors">Юридическая информация</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Свяжитесь с нами</h3>
            <div className="space-y-4">
              <div className="text-muted-foreground">
                <p className="font-medium">Телефон:</p>
                <p className="mt-1">+7 (999) 123-45-67</p>
              </div>
              <div className="text-muted-foreground">
                <p className="font-medium">Email:</p>
                <p className="mt-1">info@kastom.ru</p>
              </div>
              <div className="text-muted-foreground">
                <p className="font-medium">Часы работы:</p>
                <p className="mt-1">Пн-Вс: 10:00-22:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-lg mb-2">Подпишитесь на рассылку</h4>
              <p className="text-muted-foreground text-sm">
                Узнавайте первыми о новых коллекциях и акциях
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-2 bg-input border border-input rounded text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent min-w-[200px]"
              />
              <button className="btn-primary px-6 py-2 whitespace-nowrap">
                Подписаться
              </button>
            </div>
          </div>
        </div>

        {/* Social & Payment */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social media */}
            <div className="flex space-x-4">
              {[
                { name: 'VK', icon: 'VK', href: '#' },
                { name: 'Telegram', icon: 'TG', href: '#' },
                { name: 'Instagram', icon: 'IG', href: '#' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  title={social.name}
                >
                  <span className="text-sm font-medium">{social.icon}</span>
                </a>
              ))}
            </div>

            {/* Payment methods */}
            <div className="flex space-x-2">
              {['Visa', 'Mastercard', 'МИР'].map((method) => (
                <div
                  key={method}
                  className="w-12 h-8 bg-secondary rounded flex items-center justify-center"
                >
                  <span className="text-xs font-medium">{method}</span>
                </div>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-muted-foreground text-sm text-center md:text-left">
              © 2024 KASTOM. Все права защищены.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;