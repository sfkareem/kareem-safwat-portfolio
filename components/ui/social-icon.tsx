import { Button } from "@/components/ui/button";
import Image from "next/image";

const ButtonSocialIconDemo = () => {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* linkedin */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer"
        onClick={() => window.open("https://linkedin.com/in/kareemsafwat", "_blank")}
      >
        <Image
          src="https://images.shadcnspace.com/assets/svgs/icon-linkedin.svg"
          alt="linkedin icon"
          width={16}
          height={16}
          referrerPolicy="no-referrer"
          className="h-4 w-4"
        />
      </Button>
      {/* email */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer"
        onClick={() => window.location.href = "mailto:kareemsf1995@gmail.com"}
      >
        <Image
          src="https://images.shadcnspace.com/assets/svgs/icon-google.svg"
          alt="google icon"
          width={16}
          height={16}
          referrerPolicy="no-referrer"
          className="h-4 w-4"
        />
      </Button>
    </div>
  );
};

export default ButtonSocialIconDemo;
