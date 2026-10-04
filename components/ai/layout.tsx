'use client';
import { DocsLayout as Layout, type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { MessageCircleIcon } from 'lucide-react';
import {
  AISearch,
  AISearchPanel,
  AISearchTrigger,
  useAISearchContext,
  useHotKey,
} from './search';

export function DocsLayout(props: DocsLayoutProps) {
  return (
    <AISearch>
      <ChatLayout {...props} />
      <AISearchTrigger
        position="float"
        className={buttonVariants({
          variant: 'secondary',
          className: 'text-fd-muted-foreground rounded-2xl',
        })}
      >
        <MessageCircleIcon className="size-4.5" />
        Ask AI
      </AISearchTrigger>
    </AISearch>
  );
}

function ChatLayout(props: DocsLayoutProps) {
  const { open, setOpen } = useAISearchContext();
  useHotKey();

  return <Layout {...props} aiChat={{ open, onOpenChange: setOpen, panel: <AISearchPanel /> }} />;
}
