# Stripe test-mode backend (Netlify Functions)

## Vereiste environment variables
- `APP_BASE_URL`
- `STRIPE_SECRET_KEY` (sk_test...)
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET` (Stripe CLI / Dashboard webhook signing secret)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Webhook configuratie
1. Maak in Stripe (test mode) een endpoint dat wijst naar `/.netlify/functions/stripe_webhook` van de live/preview site.
2. Kopieer de signing secret naar `STRIPE_WEBHOOK_SECRET`.
3. Zorg dat de events `checkout.session.completed`, `customer.subscription.updated` en `customer.subscription.deleted` worden verstuurd.

## Testkaart
- Nummer: `4242 4242 4242 4242`
- Elke toekomstige vervaldatum en CVC volstaan.

## Handmatige testflow
1. Start de app met een test Supabase access token en roep `/.netlify/functions/stripe_create_checkout_session` aan.
2. Voltooi de Stripe Checkout met de testkaart.
3. Controleer dat `/.netlify/functions/stripe_entitlement` `isPremium: true` teruggeeft.
4. Annuleer de subscription in Stripe; herhaal stap 3 om te verifiëren dat `isPremium` weer `false` wordt.

