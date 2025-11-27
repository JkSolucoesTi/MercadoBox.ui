import { FormGroup } from "@angular/forms";

export function field(form: FormGroup, name: string) {
  return form.get(name)!;
}