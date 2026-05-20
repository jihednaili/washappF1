# Documentation de l'Authentification (Spring Boot & Angular)

## 1. Description du Flux (Flow)
Nous avons mis en place une architecture d'authentification complète base sur **Spring Security 6** et **JWT (JSON Web Tokens)** coté backend.
Le flux fonctionne comme suit :
1. L'utilisateur (ou l'Admin Lavage/Super Admin) s'identifie avec un couple `nom d'utilisateur / mot de passe`.
2. Le `AuthController` coté Spring Boot vérifie les informations via `AuthenticationManager`.
3. Si valides, un **Token JWT** est généré par `JwtUtils`. Ce token inclut des *claims* intégrés (notamment le nom d'utilisateur, la date d'expiration, et implicitement la signature).
4. Le Backend retourne ce Token ainsi que le(s) rôle(s) et les IDs de l'utilisateur à l'application Angular.
5. L'application Angular stocke le Token de façon sécurisée (SessionStorage/LocalStorage) et l'inclut dans le header `Authorization: Bearer <token>` pour toutes ses requêtes futures grâce à un `HttpInterceptor`.
6. Lors des requêtes ultérieures vers les routes protégées du backend, `AuthTokenFilter` intercepte et valide le Token. Si valide, le contexte sécurisé de la requête (`SecurityContextHolder`) est peuplé avec les permissions (`Authorities`), permettant l'accès aux endpoints.

## 2. Rôles et Permissions (Claims)
L'authentification est basée sur l'énumération `ERole`, qui implémente les rôles décrits dans le cahier des charges :
- **ROLE_USER** : Les automobilistes classiques. Peuvent rechercher, réserver et voir l'état des stations.
- **ROLE_ADMIN_LAVAGE** : Les propriétaires de station. Gèrent les configurations de lavage, le personnel et leur station.
- **ROLE_SUPER_ADMIN** : Le propriétaire SaaS. Accès global aux statistiques et gestion des stations.

Un utilisateur peut potentiellement avoir plusieurs rôles (ex: Un super admin est aussi un utilisateur).

## 3. Implémentation de Sécurité (Back-end)
Les fichiers principaux impliqués côté backend :
- `WebSecurityConfig.java` : Configuration principale de la sécurité HTTP (définition des routes publiques comme `/api/auth/**` vs routes privées), désactivation de la session STATELESS.
- `JwtUtils.java` : Utilitaire pour la génération, l'extraction de *claims* et la validation des certificats JWT via la librairie io.jsonwebtoken.
- `UserDetailsImpl.java` et `UserDetailsServiceImpl.java` : Implémentent l'interface de Spring Security qui récupère un User dans la base de données (PostgreSQL) et le transforme en objet d'authentification valide avec les *GrantedAuthorities* correspondantes aux rôles.
- `AuthTokenFilter.java` : Filtre exécuté avant chaque requête interceptant et décodant le header "Bearer".

## 4. Ce Qui a été Mis en Place Aujourd'hui
- Création de la structure projet vierge Spring Boot et Angular.
- Création du modèle de base de données relationnelle (PostgreSQL) pour les `Users` et `Roles` (Relation Many-to-Many).
- Implémentation du noyau de sécurisation `security/jwt/*`.
- Création des Payload DTO (Request/Response) pour structurer le JSON inter-applicatif.
