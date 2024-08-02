const handleBinks = (message) => {
  if (message.content.startsWith('!binks')) {
    const msg = message.content.replace('!binks', '').trim();
    if (msg.length === 0) {
      const rv = 'Please provide a question or instruction';
      return rv;
    }
  } else {
    return msg;
  }
}
