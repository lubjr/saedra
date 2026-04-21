import ttossEslintConfig from "@ttoss/eslint-config";

export default [
  { ignores: [".next/**", ".source/**", "dist/**"] },
  ...ttossEslintConfig,
];
