export function CLickLabel(htmlFor: string) {
  const label = document.querySelector(
    `label[for="${htmlFor}"]`
  ) as HTMLLabelElement
  label?.click()

  return
}