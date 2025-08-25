type Props = {
  categories: string[];
  current: string;
  onChange: (v: string) => void;
};

export default function CategoryTabs({ categories, current, onChange }: Props) {
  return (
    <div className="catbar-wrap">
      <nav className="catbar">
        {categories.map((c) => {
          const isActive = c === current;
          return (
            <div
              key={c}
              className={`tab ${isActive ? "active" : ""}`}
              onClick={() => onChange(c)}
              role="button"
              aria-current={isActive ? "page" : undefined}
            >
              {c}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

