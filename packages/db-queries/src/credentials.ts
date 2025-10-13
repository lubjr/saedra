import { supabase } from "@repo/db-connector/db";

interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

type AwsCredentialsDBType = {
  insertCredentials(projectId: string, creds: AwsCredentials): Promise<any>;
  getCredentialsByProject(projectId: string): Promise<any>;
}

export const AwsCredentialsDB: AwsCredentialsDBType = {
  async insertCredentials(projectId: string, creds: AwsCredentials) {
    return supabase.from('aws_credentials').insert({
      project_id: projectId,
      access_key_id: creds.accessKeyId,
      secret_access_key: creds.secretAccessKey,
      region: creds.region,
    }).select().single();
  },

  async getCredentialsByProject(projectId: string) {
    return supabase.from('aws_credentials').select('*').eq('project_id', projectId).single();
  },
};