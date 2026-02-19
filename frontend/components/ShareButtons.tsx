import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  RedditIcon,
} from "react-share";
import { Share2 } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const iconSize = 36;
  const iconBorderRadius = 8;

  return (
    <div className="flex items-center gap-3 flex-wrap" data-testid="container-share-buttons">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Share2 className="w-4 h-4" />
        <span>Share:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <FacebookShareButton
          url={url}
          title={title}
          data-testid="button-share-facebook"
        >
          <FacebookIcon size={iconSize} round={false} borderRadius={iconBorderRadius} />
        </FacebookShareButton>

        <TwitterShareButton
          url={url}
          title={title}
          data-testid="button-share-twitter"
        >
          <TwitterIcon size={iconSize} round={false} borderRadius={iconBorderRadius} />
        </TwitterShareButton>

        <LinkedinShareButton
          url={url}
          title={title}
          summary={description}
          data-testid="button-share-linkedin"
        >
          <LinkedinIcon size={iconSize} round={false} borderRadius={iconBorderRadius} />
        </LinkedinShareButton>

        <WhatsappShareButton
          url={url}
          title={title}
          data-testid="button-share-whatsapp"
        >
          <WhatsappIcon size={iconSize} round={false} borderRadius={iconBorderRadius} />
        </WhatsappShareButton>

        <RedditShareButton
          url={url}
          title={title}
          data-testid="button-share-reddit"
        >
          <RedditIcon size={iconSize} round={false} borderRadius={iconBorderRadius} />
        </RedditShareButton>
      </div>
    </div>
  );
}
