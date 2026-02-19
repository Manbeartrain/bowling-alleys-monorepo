import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SiLinkedin, SiX } from "react-icons/si";
import { CircleUserRound } from "lucide-react";
const gabeImage = "/attached_assets/gabe_1764704670385.webp";
const alexRImage = "/attached_assets/IMG_0863_1764705807274.webp";

interface TeamMember {
  name: string;
  nickname?: string;
  role: string;
  imageUrl?: string;
  linkedin?: string;
  twitter?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Gabe",
    nickname: "Ace",
    role: "CEO",
    imageUrl: gabeImage,
    linkedin: "",
    twitter: "",
  },
  {
    name: "Alex H",
    nickname: "Slim",
    role: "CTO",
    linkedin: "",
    twitter: "",
  },
  {
    name: "Alex R",
    nickname: "Rocket",
    role: "Senior Engineer",
    imageUrl: alexRImage,
    linkedin: "",
    twitter: "",
  },
  {
    name: "Gema",
    role: "Marketing",
    linkedin: "",
    twitter: "",
  },
];

function PlaceholderAvatar() {
  return (
    <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <CircleUserRound
        className="h-16 w-16 text-gray-300 dark:text-gray-600"
        strokeWidth={1}
      />
    </div>
  );
}

export default function Team() {
  useEffect(() => {
    const title = "Our Team – BowlingAlleys.io";
    document.title = title;

    const description =
      "Meet the team behind BowlingAlleys.io. We're passionate about connecting bowlers with the best bowling experiences across the United States.";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    const canonicalUrl = window.location.origin + "/team";
    let linkCanonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.rel = "canonical";
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setOgTag("og:title", title);
    setOgTag("og:description", description);
    setOgTag("og:url", canonicalUrl);
    setOgTag("og:type", "website");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="heading-team"
            >
              Our Team
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the people building the future of bowling discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden relative"
                data-testid={`card-team-member-${index}`}
              >
                <CardContent className="p-6 pb-8">
                  <div className="flex flex-col items-center text-center">
                    {member.imageUrl ? (
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage
                          src={member.imageUrl}
                          alt={member.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl bg-primary/10">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="mb-4">
                        <PlaceholderAvatar />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3
                        className="text-xl font-semibold"
                        data-testid={`text-team-name-${index}`}
                      >
                        {member.name}
                      </h3>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            data-testid={`link-linkedin-${index}`}
                          >
                            <SiLinkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            data-testid={`link-twitter-${index}`}
                          >
                            <SiX className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                {member.nickname && (
                  <span
                    className="absolute bottom-3 right-4 text-xs text-muted-foreground/50 italic"
                    data-testid={`text-nickname-${index}`}
                  >
                    aka {member.nickname}
                  </span>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
