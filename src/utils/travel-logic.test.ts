import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateReferenceCode,
  formatMZN,
  buildWhatsAppLink,
  validateTravelDates,
  validateQuoteRequest,
  filterAndSortPackages,
  PackageItem,
} from './travel-logic.ts';

test('generateReferenceCode formats code with current year and valid random characters', () => {
  const code = generateReferenceCode(new Date('2026-10-26'));
  assert.match(code, /^ZT-2026-[A-Z0-9]{4}$/);
});

test('formatMZN formats numbers with MT symbol and handles sob_consulta', () => {
  assert.equal(formatMZN(59500, 'MT', 'indicativo'), '59.500 MT');
  assert.equal(formatMZN(null, 'MT', 'sob_consulta'), 'Sob Consulta');
  assert.equal(formatMZN(undefined, 'MT', 'indicativo'), 'Sob Consulta');
});

test('buildWhatsAppLink generates clean URL with phone and encoded message', () => {
  const url = buildWhatsAppLink({
    phone: '+258 85 104 1826',
    customerName: 'Carlos Silva',
    packageTitle: 'Cape Town Especial',
    referenceCode: 'ZT-2026-8K2M',
  });
  assert.ok(url.startsWith('https://wa.me/258851041826?text='));
  assert.ok(url.includes('Cape%20Town%20Especial'));
  assert.ok(url.includes('Carlos%20Silva'));
  assert.ok(url.includes('ZT-2026-8K2M'));
});

test('validateTravelDates verifies departure and return sequence', () => {
  const valid = validateTravelDates('2026-11-01', '2026-11-05');
  assert.equal(valid.valid, true);

  const invalidSeq = validateTravelDates('2026-11-05', '2026-11-01');
  assert.equal(invalidSeq.valid, false);
  assert.match(invalidSeq.error || '', /posterior/);

  const missingDep = validateTravelDates('');
  assert.equal(missingDep.valid, false);
});

test('validateQuoteRequest detects empty fields and validates email format', () => {
  const invalid = validateQuoteRequest({
    customer_name: '',
    customer_phone: '',
    service_type: '',
    travelers_count: 0,
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.customer_name);
  assert.ok(invalid.errors.customer_phone);
  assert.ok(invalid.errors.service_type);
  assert.ok(invalid.errors.travelers_count);

  const valid = validateQuoteRequest({
    customer_name: 'Delfina Langa',
    customer_phone: '+258 84 321 0000',
    customer_email: 'delfina@example.co.mz',
    service_type: 'Passagens Aéreas',
    travelers_count: 2,
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('filterAndSortPackages applies filters and sorts correctly', () => {
  const samplePackages: PackageItem[] = [
    {
      id: 1,
      primary_destination_id: 1,
      destination_name: 'África do Sul',
      title: 'Cape Town Especial',
      slug: 'cape-town',
      summary: 'Fim de semana em Cape Town',
      description: 'Descrição completa',
      price_per_person: 59500,
      currency: 'MT',
      price_type: 'indicativo',
      duration_days: 3,
      duration_nights: 2,
      is_featured: 1,
      status: 'pendente_validacao',
      category_slugs: ['escapadinhas'],
    },
    {
      id: 2,
      primary_destination_id: 2,
      destination_name: 'Portugal',
      title: 'Lisboa Histórica',
      slug: 'lisboa',
      summary: 'Semana em Lisboa',
      description: 'Descrição completa',
      price_per_person: 89000,
      currency: 'MT',
      price_type: 'indicativo',
      duration_days: 7,
      duration_nights: 6,
      is_featured: 0,
      status: 'publicado',
      category_slugs: ['cultura'],
    },
  ];

  // Filtro por destino
  const filteredDest = filterAndSortPackages(samplePackages, { destinationId: 1 });
  assert.equal(filteredDest.length, 1);
  assert.equal(filteredDest[0].id, 1);

  // Ordenação por preço ascendente
  const sortedPrice = filterAndSortPackages(samplePackages, { sortBy: 'price-asc' });
  assert.equal(sortedPrice[0].id, 1);
  assert.equal(sortedPrice[1].id, 2);

  // Pesquisa por texto
  const searched = filterAndSortPackages(samplePackages, { searchQuery: 'Lisboa' });
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 2);
});
