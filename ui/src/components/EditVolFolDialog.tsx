import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { House, PenIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { InternalProperty, InternalPropertyState} from "@/types/internal-property";
import PropertyService from "@/api/property-service";

import { withMask, type Mask } from 'use-mask-input'
import { inputMaskModeManager } from "@/stories/common/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const testUtil_inputMaskMode = inputMaskModeManager();

const volumeFolioSchema = z.object({
    // Volume: 1 to 6 digits
    volume: z
        .string()
        .trim()
        .regex(/^[0-9]{1,6}$/, { message: "Volume must be 1-6 digits" })
        .or(z.literal("")),
    // Folio: 1 to 5 digits
    folio: z
        .string()
        .trim()
        .regex(/^[0-9]{1,5}$/, { message: "Folio must be 1-5 digits" })
        .or(z.literal("")),
});

type EditVolFolProps = {
    context: InternalPropertyState
    setProperty: React.Dispatch<React.SetStateAction<InternalProperty | undefined>>
}
function EditVolFol({ context, setProperty }: EditVolFolProps) {
    const [open, setOpen] = useState(false)

    const { propertyId } = context

    const updateVolumeFolio = async (newData: InternalProperty["volumeFolio"]) => {
        try {
            await PropertyService.updateVolumeFolio(propertyId, newData);
            const property = await PropertyService.getProperty(propertyId);
            setProperty(property);
        } catch (error) {
            console.error('Failed to update volume/folio:', error);
        }
    };

    const { data: property } = context

    const form = useForm<z.infer<typeof volumeFolioSchema>>({
        resolver: zodResolver(volumeFolioSchema),
        mode: "onTouched",
        defaultValues: {
            volume: property?.volumeFolio?.volume || "",
            folio: property?.volumeFolio?.folio || "",
        }
    });

    type SubmissionSchema = z.infer<typeof volumeFolioSchema>
    const onSubmit = async (data: SubmissionSchema) => {
        setOpen(false);
        await updateVolumeFolio(data);
    }

    const onOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)

        // Reset form to initial values when dialog is closed
        form.reset({
            volume: property?.volumeFolio?.volume || "",
            folio: property?.volumeFolio?.folio || "",
        });
    }

    const preventClose = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const makeMask = (mask: Mask) => testUtil_inputMaskMode.isEnabled() 
        ? withMask(mask, {
            placeholder: ''
        })
        : null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className="px-0!" asChild>
                {/* Ensure this button does not submit the outer form */} 
                <Button type="button" variant="link" data-testid="property-vol-fol">
                    {property?.volumeFolio && 
                        (property.volumeFolio.volume && property.volumeFolio.folio)
                            ? `${property.volumeFolio.volume}/${property.volumeFolio.folio}` 
                            : "N/A"} 
                    <PenIcon />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[425px]"
                onInteractOutside={(e) => preventClose(e)}
                onEscapeKeyDown={(e) => preventClose(e)}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <DialogHeader>
                            <DialogTitle className="flex items-end gap-2.5">
                                <PenIcon className='size-5' /> 
                                <span className="leading-none">Edit Volume/Folio</span>
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Enter the new Volume and Folio numbers for property 
                            <span className='flex mt-1 gap-1 items-end font-medium'>
                                <House className='size-3.5' />
                                <span className='leading-none'>{property?.fullAddress}</span>
                            </span>
                        </DialogDescription>
                        <FormField
                            control={form.control}
                            name="volume"
                            render={({ field }) => {
                                return(
                                    <FormItem>
                                        <FormLabel>Volume</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="1-6 digits" 
                                                {...field}
                                                ref={makeMask('999999')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                            )}}
                        />
                        <FormField
                            control={form.control}
                            name="folio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Folio</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="1-5 digits" 
                                            {...field}
                                            ref={makeMask('99999')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />                      
                        <DialogFooter>
                            <DialogClose asChild>
                                {/* Prevent this close button from submitting the form */}
                                <Button type="button" variant="outline">Close</Button>
                            </DialogClose>
                            <Button type="submit" disabled={
                                !form.formState.isValid || 
                                (form.watch("volume") === (property?.volumeFolio?.volume || "") &&
                                form.watch("folio") === (property?.volumeFolio?.folio || ""))
                            }>Confirm</Button>
                        </DialogFooter>
                    </form>
                </Form>                    
            </DialogContent>
        </Dialog>
    )
}

export default EditVolFol
