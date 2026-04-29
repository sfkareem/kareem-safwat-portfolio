import { Awards } from "@/components/ui/award"

export function Component({ title, subtitle, recipient, date }: { title: string, subtitle: string, recipient: string, date: string }) {
  return (
    <Awards
      variant="certificate"
      title={title}
      subtitle={subtitle}
      recipient={recipient}
      date={date}  
    />
  )
}
