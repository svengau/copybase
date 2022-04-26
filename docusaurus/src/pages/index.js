"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const Layout_1 = __importDefault(require("@theme/Layout"));
const Link_1 = __importDefault(require("@docusaurus/Link"));
const useDocusaurusContext_1 = __importDefault(require("@docusaurus/useDocusaurusContext"));
const index_module_css_1 = __importDefault(require("./index.module.css"));
const HomepageFeatures_1 = __importDefault(require("@site/src/components/HomepageFeatures"));
function HomepageHeader() {
    const { siteConfig } = (0, useDocusaurusContext_1.default)();
    return (<header className={(0, clsx_1.default)('hero hero--primary', index_module_css_1.default.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={index_module_css_1.default.buttons}>
          <Link_1.default className="button button--secondary button--lg" to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link_1.default>
        </div>
      </div>
    </header>);
}
function Home() {
    const { siteConfig } = (0, useDocusaurusContext_1.default)();
    return (<Layout_1.default title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures_1.default />
      </main>
    </Layout_1.default>);
}
exports.default = Home;
