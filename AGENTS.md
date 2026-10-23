<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the public donation page at `/` and the existing operational dashboard at `/painel` so visitors can learn about donation without entering the management shell.
- Public donation imagery uses bundled generated assets; reference screenshots inform layout but are never embedded as page images.
- Donor accounts use Cloud Auth and owner-only profiles; health questionnaire answers are saved only after sign-in, never in auth metadata.
- Donor appointments are private requests pending hemocenter confirmation, not guaranteed bookings; operational microservices remain separate.
- Keep unauthenticated donor demonstrations at `/doador-demo`, using in-memory fictional data and local File objects only; never bypass the authenticated donor gate or call private data APIs from the demo.
