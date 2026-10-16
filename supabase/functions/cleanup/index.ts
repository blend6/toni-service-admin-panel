import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) return new Response('Forbidden', { status: 403 })

  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const cutoff = new Date(Date.now() - 30 * 864e5).toISOString()

  const { data: old, error } = await sb.from('files').select('id,path').lt('created_at', cutoff)
  if (error) return new Response(error.message, { status: 500 })

  if (old.length) {
    // Fshi file-t fizikë së pari; rreshtat hiqen vetëm nëse storage u pastrua.
    const rm = await sb.storage.from('ecu-files').remove(old.map((f) => f.path))
    if (rm.error) return new Response(rm.error.message, { status: 500 })
    await sb.from('files').delete().in('id', old.map((f) => f.id))
  }
  await sb.from('activity').delete().lt('created_at', cutoff)
  return Response.json({ deleted: old.length })
})
