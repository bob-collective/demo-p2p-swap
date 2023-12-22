function truncateInscriptionId(id: string) {
  return id.slice(0, 10) + '...' + id.slice(-3);
}

export { truncateInscriptionId };
