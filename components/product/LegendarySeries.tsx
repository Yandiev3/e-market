import React from 'react'
import Link from 'next/link';

function Legendaryseries() {
  return (
<section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Легендарные серии</h2>
              <p className="text-muted-foreground">Самые свежие поступления в коллекции</p>
            </div>
            <Link 
              href="/products?sort=newest" 
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Смотреть все
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

  )
}

export default Legendaryseries