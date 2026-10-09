export const localWorkspaceId = 'local';

// One workspace on this computer; no account login is required.
export function validateLocalRequest(req: Request): Response | null {
  const host = req.headers.get('host');
  if (!host || !/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host)) {
    return Response.json({ error: 'Use PayFence through localhost.' }, { status: 403 });
  }
  const origin = req.headers.get('origin');
  if (origin && origin !== `http://${host}` && origin !== `https://${host}`) {
    return Response.json({ error: 'Origin rejected' }, { status: 403 });
  }
  return null;
}
