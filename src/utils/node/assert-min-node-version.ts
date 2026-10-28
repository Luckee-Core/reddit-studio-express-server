const REQUIRED_NODE_MAJOR = 22;

/**
 * Exits the process when the active Node.js major version is below the project minimum.
 */
export const assertMinNodeVersion = (): void => {
  const major = Number(process.versions.node.split('.')[0]);
  if (major >= REQUIRED_NODE_MAJOR) {
    return;
  }

  console.error(
    `❌ Node ${process.version} detected; reddit-studio-express-server requires Node >= ${REQUIRED_NODE_MAJOR}.`,
  );
  console.error('   Run: nvm install 22 && nvm use   (or restart the terminal after updating .nvmrc)');
  process.exit(1);
};
