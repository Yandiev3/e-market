// components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Магазин</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about" className="hover:text-white transition-colors">О нас</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Контакты</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Вакансии</Link></li>
              <li><Link href="/stores" className="hover:text-white transition-colors">Магазины</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Помощь</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/help" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition-colors">Доставка</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Возврат</Link></li>
              <li><Link href="/sizes" className="hover:text-white transition-colors">Размеры</Link></li>
              <li><Link href="/care" className="hover:text-white transition-colors">Уход за обувью</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Правовая информация</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Условия использования</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie-файлы</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">Юридическая информация</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Свяжитесь с нами</h3>
            <div className="space-y-4">
              <div className="text-gray-300">
                <p className="font-medium">Телефон:</p>
                <p className="mt-1">8 (800) 555-35-35</p>
              </div>
              <div className="text-gray-300">
                <p className="font-medium">Email:</p>
                <p className="mt-1">info@E-Store
.ru</p>
              </div>
              <div className="text-gray-300">
                <p className="font-medium">Часы работы:</p>
                <p className="mt-1">Пн-Вс: 9:00-21:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Подпишитесь на рассылку</h4>
              <p className="text-gray-300 text-sm">
                Узнавайте первыми о новых коллекциях и акциях
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                Подписаться
              </button>
            </div>
          </div>
        </div>

        {/* Social & Payment */}
        <div className="border-t border-gray-800 mt-8 pt-8">
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
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
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
                  className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center"
                >
                  <span className="text-xs font-medium">{method}</span>
                </div>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © 2024 E-Store
. Все права защищены.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;