"use client";

type ErrorCopyType = "mcq" | "true_false";

type ErrorCopySession = {
  pool: string[];
  index: number;
};

const ERROR_COPY_MAP: Record<ErrorCopyType, string[]> = {
  mcq: [
    "No pasa nada. Esta idea se construye con el tiempo.",
    "Equivocarse también es parte del proceso.",
    "Buen intento. Miremos esto con calma.",
  ],
  true_false: [
    "No pasa nada. Esta idea se construye con el tiempo.",
    "Equivocarse también es parte del proceso.",
    "Buen intento. Miremos esto con calma.",
  ],
};

const shuffle = (items: string[]) =>
  items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.value);

const sessions: Record<ErrorCopyType, ErrorCopySession> = {
  mcq: { pool: shuffle([...ERROR_COPY_MAP.mcq]), index: 0 },
  true_false: { pool: shuffle([...ERROR_COPY_MAP.true_false]), index: 0 },
};

export const getErrorCopy = (type: ErrorCopyType) => {
  const session = sessions[type];
  if (!session) return "";
  if (session.index >= session.pool.length) {
    session.pool = shuffle([...ERROR_COPY_MAP[type]]);
    session.index = 0;
  }
  const copy = session.pool[session.index];
  session.index += 1;
  return copy;
};
