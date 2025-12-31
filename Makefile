include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-owq-power
PKG_VERSION:=1.0.3
PKG_RELEASE:=1

PKG_MAINTAINER:=isalikai
PKG_LICENSE:=GPL-3.0-or-later
PKG_LICENSE_FILES:=LICENSE

# 引入 OpenWrt 标准构建规则
include $(INCLUDE_DIR)/package.mk

# ---------------------------------------------------
# 1. 主程序定义
# ---------------------------------------------------
define Package/$(PKG_NAME)
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=OWQ Power Control
  DEPENDS:=+luci-base
  PKGARCH:=all
endef

define Package/$(PKG_NAME)/description
  Simple Power Control (Reboot/Shutdown) for OpenWrt.
endef

# --- 关键修复：定义一个空的编译步骤 ---
# 告诉 SDK：这是一个纯脚本包，不需要执行 make 编译
define Build/Compile
endef

# 主程序安装规则
define Package/$(PKG_NAME)/install
	# 安装 JS
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view
	$(INSTALL_DATA) ./htdocs/luci-static/resources/view/owq-power.js $(1)/www/luci-static/resources/view/

	# 安装 菜单
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./root/usr/share/luci/menu.d/luci-app-owq-power.json $(1)/usr/share/luci/menu.d/

	# 安装 ACL
	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) ./root/usr/share/rpcd/acl.d/luci-app-owq-power.json $(1)/usr/share/rpcd/acl.d/
endef

# ---------------------------------------------------
# 2. 中文包定义
# ---------------------------------------------------
define Package/luci-i18n-owq-power-zh-cn
  SECTION:=luci
  CATEGORY:=LuCI
  TITLE:=Chinese translations for owq-power
  DEPENDS:=+luci-app-owq-power
  PKGARCH:=all
endef

# 中文包安装规则
define Package/luci-i18n-owq-power-zh-cn/install
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/i18n
	# 编译并安装 .lmo 文件
	po2lmo ./po/zh-cn/owq-power.po $(1)/usr/lib/lua/luci/i18n/owq-power.zh-cn.lmo
endef

# ---------------------------------------------------
# 3. 执行构建
# ---------------------------------------------------
$(eval $(call BuildPackage,$(PKG_NAME)))
$(eval $(call BuildPackage,luci-i18n-owq-power-zh-cn))