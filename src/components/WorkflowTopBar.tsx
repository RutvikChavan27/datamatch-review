import { List, Sparkles } from "lucide-react";

export function TopBar() {
  return (
    <div className="app-header">
      <div className="header-left">
        <div className="menu-button">
          <List size={18} />
        </div>
        <img 
          src="/lovable-uploads/4112f756-9ca3-482c-8c5b-c5d158eaf2ec.png" 
          alt="MaxxLogix" 
          className="header-logo"
        />
        <div className="module-separator"></div>
        <div className="module-name font-inter font-semibold text-foreground">Workflow Designer</div>
      </div>
      <div className="ai-badge-container">
        <div className="ai-badge-content">
          <Sparkles className="ai-sparkles-icon" size={16} />
          <span className="ai-badge-text font-roboto font-medium text-foreground">AI Productivity Engine</span>
        </div>
      </div>
    </div>
  );
}