interface PageHeaderProps {
  readonly title: string;
  readonly description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-3xl text-sm text-muted-fg">{description}</p>
    </div>
  );
}
