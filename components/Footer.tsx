import Link from 'next/link';
import { VALID_URL_GENDERS, GENDER_LABELS, ORIGINS, ORIGIN_LABELS } from '@/lib/seo/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Featured On Badge */}
        <div className="text-center mb-10">
          <p className="text-sm text-gray-400 mb-2">As Featured In</p>
          <a 
            href="https://www.smartconsumerinsight.com/baby-names/best-baby-name-generators"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <span className="text-yellow-300 text-lg">⭐</span>
            <span className="font-semibold">#1 Best Baby Name Generator 2025</span>
            <span className="text-yellow-300 text-lg">⭐</span>
          </a>
          <p className="text-xs text-gray-500 mt-2">
            Ranked by Smart Consumer Insight
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Browse by Gender */}
          <div>
            <h3 className="text-white font-semibold mb-4">Browse by Gender</h3>
            <ul className="space-y-2">
              {VALID_URL_GENDERS.map(gender => (
                <li key={gender}>
                  <Link href={`/names/${gender}`} className="hover:text-indigo-400 transition-colors">
                    {GENDER_LABELS[gender]} Names
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Origins */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Origins</h3>
            <ul className="space-y-2">
              {ORIGINS.slice(0, 6).map(origin => (
                <li key={origin}>
                  <Link href={`/names/origin/${origin}`} className="hover:text-indigo-400 transition-colors">
                    {ORIGIN_LABELS[origin]} Names
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/names/popularity/popular" className="hover:text-indigo-400 transition-colors">
                  Popular Names
                </Link>
              </li>
              <li>
                <Link href="/names/popularity/unique" className="hover:text-indigo-400 transition-colors">
                  Unique Names
                </Link>
              </li>
              <li>
                <Link href="/names/religion/christian" className="hover:text-indigo-400 transition-colors">
                  Biblical Names
                </Link>
              </li>
              <li>
                <Link href="/names/characteristic/strong" className="hover:text-indigo-400 transition-colors">
                  Strong Names
                </Link>
              </li>
              <li>
                <Link href="/names/characteristic/cute" className="hover:text-indigo-400 transition-colors">
                  Cute Names
                </Link>
              </li>
              <li>
                <Link href="/names" className="hover:text-indigo-400 transition-colors">
                  All Names →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">AI Baby Namer</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/names" className="hover:text-indigo-400 transition-colors">
                  Browse Names
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/lists" className="hover:text-indigo-400 transition-colors">
                  My Lists
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} AI Baby Namer. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              AI-powered baby name recommendations based on your preferences.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <a 
              href="https://www.smartconsumerinsight.com/baby-names/best-baby-name-generators"
              target="_blank"
              rel="noopener"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
            >
              Best Baby Name Generators
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
