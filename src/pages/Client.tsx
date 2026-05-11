import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ChatContainer } from "@/components/client/ChatContainer";

export function ClientPage() {
  return (
    <div className="bg-[#EAE3D2]/40 min-h-[calc(100vh-64px)] px-0 sm:px-4">
      <PhoneFrame>
        <ChatContainer />
      </PhoneFrame>
    </div>
  );
}
