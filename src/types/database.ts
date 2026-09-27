export type PostStatus = "draft" | "published";
export type ProfileRole = "admin" | "editor";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          role: ProfileRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          role?: ProfileRole;
        };
        Update: Partial<{
          full_name: string;
          avatar_url: string | null;
          role: ProfileRole;
        }>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
        };
        Update: Partial<{ name: string; slug: string; description: string | null }>;
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: { id?: string; name: string; slug: string };
        Update: Partial<{ name: string; slug: string }>;
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image_url: string | null;
          category_id: string | null;
          author_id: string | null;
          status: PostStatus;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string;
          featured_image_url?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: PostStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
        };
        Update: Partial<{
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image_url: string | null;
          category_id: string | null;
          status: PostStatus;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
        }>;
      };
      post_tags: {
        Row: { post_id: string; tag_id: string };
        Insert: { post_id: string; tag_id: string };
        Update: Partial<{ post_id: string; tag_id: string }>;
      };
    };
  };
}

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface PostWithRelations extends Post {
  category: Category | null;
  tags: Tag[];
}
