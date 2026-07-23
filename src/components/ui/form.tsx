import  as React from react
import  as LabelPrimitive from @radix-uireact-label
import { Slot } from @radix-uireact-slot
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from react-hook-form
import { cn } from @libutils
import { Label } from @componentsuilabel

const Form = FormProvider

type FormFieldContextValue
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathTFieldValues = FieldPathTFieldValues
 = {
  name TName
}

const FormFieldContext = React.createContextFormFieldContextValue(
  {} as FormFieldContextValue
)

const FormField = 
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathTFieldValues = FieldPathTFieldValues
({
  ...props
} ControllerPropsTFieldValues, TName) = {
  return (
    FormFieldContext.Provider value={{ name props.name }}
      Controller {...props} 
    FormFieldContext.Provider
  )
}

const useFormField = () = {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error(useFormField should be used within FormField)
  }

  const { id } = itemContext

  return {
    id,
    name fieldContext.name,
    formItemId `${id}-form-item`,
    formDescriptionId `${id}-form-item-description`,
    formMessageId `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id string
}

const FormItemContext = React.createContextFormItemContextValue(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributesHTMLDivElement
(({ className, ...props }, ref) = {
  const id = React.useId()

  return (
    FormItemContext.Provider value={{ id }}
      div ref={ref} className={cn(space-y-2, className)} {...props} 
    FormItemContext.Provider
  )
})
FormItem.displayName = FormItem

const FormLabel = React.forwardRef
  React.ElementReftypeof LabelPrimitive.Root,
  React.ComponentPropsWithoutReftypeof LabelPrimitive.Root
(({ className, ...props }, ref) = {
  const { error, formItemId } = useFormField()

  return (
    Label
      ref={ref}
      className={cn(error && text-destructive, className)}
      htmlFor={formItemId}
      {...props}
    
  )
})
FormLabel.displayName = FormLabel

const FormControl = React.forwardRef
  React.ElementReftypeof Slot,
  React.ComponentPropsWithoutReftypeof Slot
(({ ...props }, ref) = {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
           `${formDescriptionId}`
           `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    
  )
})
FormControl.displayName = FormControl

const FormDescription = React.forwardRef
  HTMLParagraphElement,
  React.HTMLAttributesHTMLParagraphElement
(({ className, ...props }, ref) = {
  const { formDescriptionId } = useFormField()

  return (
    p
      ref={ref}
      id={formDescriptionId}
      className={cn(text-sm text-muted-foreground, className)}
      {...props}
    
  )
})
FormDescription.displayName = FormDescription

const FormMessage = React.forwardRef
  HTMLParagraphElement,
  React.HTMLAttributesHTMLParagraphElement
(({ className, children, ...props }, ref) = {
  const { error, formMessageId } = useFormField()
  const body = error  String(error.message)  children

  if (!body) {
    return null
  }

  return (
    p
      ref={ref}
      id={formMessageId}
      className={cn(text-sm font-medium text-destructive, className)}
      {...props}
    
      {body}
    p
  )
})
FormMessage.displayName = FormMessage

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}