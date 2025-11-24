import { FormBuilder } from "@/components/forms/form-builder";
import { SiteNav } from "@/components/site-nav";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <SiteNav />
      <div className="flex-1 overflow-hidden">
        <FormBuilder />
      </div>
    </div>
  );
}
