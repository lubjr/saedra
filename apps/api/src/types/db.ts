export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          created_at: string;
          name: string;
        };
      };
    };
  };
}
