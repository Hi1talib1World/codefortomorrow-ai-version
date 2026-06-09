import { GlowCard } from "@/components/ui/spotlight-card";

export function Default(){
  return(
    <div className="w-screen h-screen flex flex-row items-center justify-center gap-10 custom-cursor">
      <GlowCard>
        <div className="p-6">Card 1</div>
      </GlowCard>
      <GlowCard>
        <div className="p-6">Card 2</div>
      </GlowCard>
      <GlowCard>
        <div className="p-6">Card 3</div>
      </GlowCard>
    </div>
  );
}

export default Default;
