import Rollbar from 'rollbar';

export function initRollbarAlerting() {
  let rollbar: Rollbar | undefined;

  if (
    import.meta.env.MODE === 'production' &&
    !!import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN
  ) {
    const rollbarConfig = {
      accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
      environment: import.meta.env.MODE,
    };

    rollbar = new Rollbar(rollbarConfig);
  }

  return rollbar;
}
