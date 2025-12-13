import { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: ReactNode;
  className?: string;
  children?: ReactNode; // Allowing children for flexibility
}

function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  className = '',
  children,
}: PageHeaderProps) {
  return (
    <div className={`space-y-4 mb-6 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-neutral-300">/</span>}
                {item.href ? (
                  <a href={item.href} className="hover:text-brand-600 transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className={index === breadcrumbs.length - 1 ? "text-neutral-900 font-medium" : ""}>
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
          {description && (
            <p className="text-sm text-neutral-500">{description}</p>
          )}
          {children}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}

export default PageHeader;

