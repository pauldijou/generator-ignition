interface Log {
  severity: string;
  message: string;
}

function print(log: Log) {
  console.log('[' + log.severity.toUpperCase() + '] ' + log.message);
}

print({severity: 'Success', message: 'Your application is running!'});
