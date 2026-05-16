import { useState } from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  title: string;
  url?: string;
}

const ShareProduct = ({ title, url }: Props) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');
  const message = `Check out ${title} on Super Beauty: ${shareUrl}`;

  const handleNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url: shareUrl });
      } catch {
        // user cancelled
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy');
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Share product"
          className="rounded-full border border-border p-2 hover:bg-accent transition-colors"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <DropdownMenuItem onClick={handleNative}>
            <Share2 className="h-4 w-4 mr-2" /> Share…
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareProduct;
