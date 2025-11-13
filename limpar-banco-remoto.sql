-- Script para limpar banco D1 remoto completamente
-- Execute com: npx wrangler d1 execute D1 --remote --file=limpar-banco-remoto.sql

-- Desabilitar foreign keys temporariamente
PRAGMA foreign_keys = OFF;

-- Deletar TODAS as tabelas em PORTUGUÊS (se existirem)
DROP TABLE IF EXISTS usuarios_sessions;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS midia;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS produtos_imagens;
DROP TABLE IF EXISTS produtos_especificacoes;
DROP TABLE IF EXISTS produtos_selos;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS depoimentos;
DROP TABLE IF EXISTS parceiros;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS paginas;
DROP TABLE IF EXISTS dados_empresa_contato_telefones;
DROP TABLE IF EXISTS dados_empresa_enderecos;
DROP TABLE IF EXISTS dados_empresa_horarios_atendimento;
DROP TABLE IF EXISTS dados_empresa;

-- Deletar tabelas antigas em INGLÊS (se existirem)
DROP TABLE IF EXISTS users_sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS products_images;
DROP TABLE IF EXISTS products_specifications;
DROP TABLE IF EXISTS products_badges;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS partners;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS company_info_contact_phones;
DROP TABLE IF EXISTS company_info_addresses;
DROP TABLE IF EXISTS company_info_business_hours;
DROP TABLE IF EXISTS company_info;

-- Deletar tabelas do Payload (para recriar)
DROP TABLE IF EXISTS payload_locked_documents_rels;
DROP TABLE IF EXISTS payload_locked_documents;
DROP TABLE IF EXISTS payload_preferences_rels;
DROP TABLE IF EXISTS payload_preferences;
DROP TABLE IF EXISTS payload_migrations;

-- Reabilitar foreign keys
PRAGMA foreign_keys = ON;

-- Agora o banco está completamente limpo e pronto para a migração
