import { requireAuth, selectApiToken, handleFetchError, parseError } from "./helpers.js";

export async function tokenCreateCommand(name?: string) {
  const config = requireAuth();
  const tokenName = name?.trim() || "CI";

  try {
    const res = await fetch(`${config.apiUrl}/projects/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.token}`,
      },
      body: JSON.stringify({ name: tokenName }),
    });

    if (!res.ok) {
      console.error(`\nFailed to create token: ${await parseError(res)}`);
      process.exit(1);
    }

    const created = (await res.json()) as { token: string };

    console.log(`\nToken created. Save it now — it won't be shown again.\n`);
    console.log(`  ${created.token}\n`);
    console.log(`Use it in CI as SAEDRA_TOKEN.\n`);
  } catch (err) {
    handleFetchError(err);
  }
}

export async function tokenListCommand() {
  const config = requireAuth();

  try {
    const res = await fetch(`${config.apiUrl}/projects/tokens`, {
      headers: { "Authorization": `Bearer ${config.token}` },
    });

    if (!res.ok) {
      console.error(`\nFailed to list tokens: ${await parseError(res)}`);
      process.exit(1);
    }

    const tokens = (await res.json()) as Array<{
      id: string;
      name: string;
      token_prefix: string;
      created_at: string;
      last_used_at: string | null;
    }>;

    if (!tokens.length) {
      console.log("\nNo tokens found. Create one with: saedra token create\n");
      return;
    }

    console.log("\n  Your tokens:\n");
    for (const t of tokens) {
      const created = new Date(t.created_at).toLocaleDateString();
      const lastUsed = t.last_used_at ? new Date(t.last_used_at).toLocaleDateString() : "never";
      console.log(`  - ${t.name} (${t.token_prefix}...)`);
      console.log(`      Created:   ${created}`);
      console.log(`      Last used: ${lastUsed}`);
    }
    console.log();
  } catch (err) {
    handleFetchError(err);
  }
}

export async function tokenRevokeCommand() {
  const config = requireAuth();

  const token = await selectApiToken(config);

  try {
    const res = await fetch(`${config.apiUrl}/projects/tokens/${token.id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${config.token}` },
    });

    if (!res.ok) {
      console.error(`\nFailed to revoke token: ${await parseError(res)}`);
      process.exit(1);
    }

    console.log(`\nToken revoked successfully.\n`);
  } catch (err) {
    handleFetchError(err);
  }
}
