interface PageTitleProps {
  title: string;
  subTitle: string;
}

export default function PageTitle({ title, subTitle }: PageTitleProps) {
  return (
    <div className="flex flex-col justify-center gap-1">
      <h1 className="font-bold text-3xl">{title}</h1>
      <h2 className="text-gray-400 font-medium text-sm">{subTitle}</h2>
    </div>
  );
}
