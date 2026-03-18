import { BRAND_COLORS } from '../constants';

/**
 * Converte nome da marca para cor hexadecimal
 * @param brandName - Nome da marca (ex: 'Medley', 'Cimed')
 * @returns Cor hexadecimal da marca ou cinza padrão
 * 
 * @example
 * getBrandColor('Medley') // '#06b6d4'
 * getBrandColor('Marca Desconhecida') // '#9ca3af' (gray-400)
 */
export function getBrandColor(brandName: string | undefined): string {
  if (!brandName) {
    return '#9ca3af'; // gray-400 padrão
  }

  // Converte para uppercase e remove espaços extras
  const normalizedBrand = brandName.toUpperCase().trim();

  // Tenta encontrar a cor no objeto BRAND_COLORS
  return BRAND_COLORS[normalizedBrand as keyof typeof BRAND_COLORS] || '#9ca3af';
}
