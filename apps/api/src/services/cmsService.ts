import { CmsBanner, CmsPage, CmsSetting } from "@repo/database";
import { NotFoundError } from "@repo/shared/errors";

export async function getBanners() {
  return CmsBanner.findAll({
    where: { is_active: true },
    order: [["display_order", "ASC"]], // Fixed: sort_order -> display_order
  });
}

export async function getPage(slug: string) {
  const page = await CmsPage.findOne({
    where: { slug, is_published: true }, // Fixed: is_active -> is_published
  });

  if (!page) throw new NotFoundError("Page");
  return page;
}

export async function getAllPages() {
  return CmsPage.findAll();
}

export async function updatePage(id: number, data: Partial<CmsPage>) {
  const page = await CmsPage.findByPk(id);

  if (!page) throw new NotFoundError("Page");

  await page.update(data);
  return page;
}

export async function getSettings() {
  const settings = await CmsSetting.findAll();
  // Convert array to object key-value
  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => {
    settingsMap[s.setting_key] = s.setting_value || "";
  });
  return settingsMap;
}

export async function getSettingByKey(key: string) {
  const setting = await CmsSetting.findOne({ where: { setting_key: key } });
  if (!setting) throw new NotFoundError("Setting");
  return setting;
}
