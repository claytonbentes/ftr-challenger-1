import { useForm } from "@tanstack/react-form";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextInput";
import { DownloadIcon, LinkIcon } from "@phosphor-icons/react";
import Logo from "@/assets/Logo.svg";
import Links from "@/components/Links";
import { useListShortLinks } from "@/queries/short-url/list-short-links";
import { z } from "zod";
import { useCreateShortLink } from "@/queries/short-url/create-short-link";
import { useExportShortLinksCsv } from "@/queries/short-url/export-short-links-csv";
import { downloadUrl } from "@/utils/download-url";

const formSchema = z.object({
  originalUrl: z.string().min(1).refine((url) => {
    // Aceita URLs com ou sem protocolo
    const urlPattern = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/.*)?$/i;
    return urlPattern.test(url);
  }, { message: "URL inválida" }),
  slug: z.string().min(1),
});

export default function Home() {
  const { data: links } = useListShortLinks();
  const { exportShortLinksCsv } = useExportShortLinksCsv();
  const { createShortLink, } = useCreateShortLink();
  const form = useForm({
    validators: {
      onChange: formSchema,
    },
    defaultValues: {
      originalUrl: "",
      slug: "",
    },
    onSubmit: async ({ formApi, value}) => {
      // Adiciona https:// se não houver protocolo
      let originalUrl = value.originalUrl;
      if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
        originalUrl = 'https://' + originalUrl;
      }
      
      await createShortLink({
        originalUrl,
        slug: value.slug,
      });
      formApi.reset()
    },
  });

  return (
    <div className="h-dvh flex justify-center">
      <div className="flex flex-col gap-5 w-full max-w-4xl px-4 lg:px-0 items-stretch">
        <div className="mt-12 lg:mt-24 w-full flex justify-center lg:justify-start">
          <img src={Logo} alt="Brev" className="w-24 h-6" />
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-12">
          <form className="flex flex-col p-8 gap-4 bg-gray-100 w-11/12 lg:w-2/5" onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}>
            <>
              <p className="typography-lg text-gray-600">Novo link</p>
              <form.Field name="originalUrl"
                children={(field) => (
                  <TextField 
                    id={field.name}
                    name={field.name}
                    label="Link Original"
                    placeholder="www.exemplo.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                )}
              />
              <form.Field name="slug"
                children={(field) => (
                  <TextField 
                    id={field.name}
                    name={field.name}
                    label="Link Encurtado"
                    prefix="brev.ly/"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                )}
              />
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar link'}
                  </Button>
                )}
              />
            </>
          </form>

          <div className="flex flex-col bg-gray-100 p-8 gap-4 w-11/12 lg:w-3/5">
            <div className="flex justify-between items-center gap-4">
              <p className="typography-lg text-gray-600">Meus links</p>
              <Button className="h-8" icon={<DownloadIcon size={16} className="text-gray-600" />} secondary onClick={async () => {
                const { reportUrl } = await exportShortLinksCsv();
                await downloadUrl(reportUrl);
              }}>Baixar CSV</Button>
            </div>

            {links === undefined || links.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 border-t border-gray-200 pt-4">
                <LinkIcon size={32} className="text-gray-400" />
                <p className="typography-xs text-gray-500">Ainda não existem links cadastrados</p>
              </div>
            )}

            {links && links.length > 0 && (
              <Links />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}