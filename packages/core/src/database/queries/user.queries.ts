export async function deductCredit(database: any, userId: string) {
  return { success: true };
}

export async function getUserCredits(database: any, userId: string) {
  return { creditsRemaining: 10 };
}

export function nextMonthReset() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d;
}
