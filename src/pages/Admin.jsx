import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { createClient } from "@supabase/supabase-js";
import supabaseClient from "../config/supabaseClient";
import styles from "../styles/Admin.module.css";
import logo from "../assets/LogoBluePNG.png";
import {
    FaArrowDown,
    FaArrowLeft,
    FaArrowUp,
    FaCloudArrowUp,
    FaGoogle,
    FaGripVertical,
    FaPen,
    FaPlus,
    FaRightFromBracket,
    FaStar,
    FaTrash,
    FaXmark,
} from "react-icons/fa6";

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || "";
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || "";
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || "";
const USE_AUTH0_SUPABASE_JWT =
    Boolean(AUTH0_AUDIENCE) ||
    import.meta.env.VITE_SUPABASE_USE_AUTH0_JWT === "true";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const CLOUDINARY_CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dabmjz0xr";
const CLOUDINARY_UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const ALLOWED_ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
const REQUIRED_AUTH0_CONNECTION = "google-oauth2";

const EMPTY_FORM = {
    projectName: "",
    isArchitecture: true,
    client: "",
    location: "",
    year: String(new Date().getFullYear()),
    display_order: "",
    imageYPosition: 0,
    tagsText: "",
    descriptionTr: "",
    descriptionEn: "",
    projectPictureUrl: [],
};

function parseDescription(description) {
    if (!description) return { tr: "", en: "" };
    if (typeof description === "string") {
        return { tr: description, en: description };
    }
    return {
        tr: description["Türkçe"] || description.tr || "",
        en: description["English"] || description.en || "",
    };
}

const AdminDashboard = () => {
    const {
        isLoading: authLoading,
        isAuthenticated,
        user,
        error: authError,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        getIdTokenClaims,
    } = useAuth0();

    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("all"); // 'all' | 'architecture' | 'product'
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [urlInput, setUrlInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [draggedId, setDraggedId] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);
    const [isReordering, setIsReordering] = useState(false);

    const [toast, setToast] = useState(null); // { type: 'success' | 'error', text: string }
    const dialogRef = useRef(null);
    const fileInputRef = useRef(null);

    const showToast = useCallback((type, text) => {
        setToast({ type, text });
    }, []);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(timer);
    }, [toast]);

    // Use Auth0 JWT with Supabase when Third-Party Auth is enabled
    const dbClient = useMemo(() => {
        if (!isAuthenticated || !USE_AUTH0_SUPABASE_JWT) {
            return supabaseClient;
        }
        return createClient(SUPABASE_URL, SUPABASE_KEY, {
            accessToken: async () => {
                if (AUTH0_AUDIENCE) {
                    return await getAccessTokenSilently({
                        authorizationParams: { audience: AUTH0_AUDIENCE },
                    });
                }
                const claims = await getIdTokenClaims();
                return claims?.__raw ?? null;
            },
        });
    }, [isAuthenticated, getAccessTokenSilently, getIdTokenClaims]);

    const userEmail = user?.email?.toLowerCase() || "";
    const isGoogleConnection =
        typeof user?.sub === "string" &&
        user.sub.startsWith(`${REQUIRED_AUTH0_CONNECTION}|`);
    const isEmailVerified = user?.email_verified === true;
    const isAuthorized = useMemo(() => {
        if (!isAuthenticated || ALLOWED_ADMIN_EMAILS.length === 0) return false;
        return (
            ALLOWED_ADMIN_EMAILS.includes(userEmail) &&
            isGoogleConnection &&
            isEmailVerified
        );
    }, [isAuthenticated, userEmail, isGoogleConnection, isEmailVerified]);

    const fetchProjects = useCallback(async () => {
        setLoadingProjects(true);
        const { data, error } = await dbClient
            .from("cadance_projects")
            .select("*")
            .order("display_order", { ascending: true, nullsFirst: false })
            .order("id", { ascending: true });

        if (error) {
            showToast("error", `Failed to load projects: ${error.message}`);
            setProjects([]);
        } else {
            setProjects(data || []);
        }
        setLoadingProjects(false);
    }, [dbClient, showToast]);

    useEffect(() => {
        if (isAuthorized) {
            fetchProjects();
        }
    }, [isAuthorized, fetchProjects]);

    // Sync native <dialog> element with modal state
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isModalOpen) {
            if (!dialog.open) dialog.showModal();
        } else if (dialog.open) {
            dialog.close();
        }
    }, [isModalOpen]);

    const handleAuth0SignIn = () => {
        loginWithRedirect({
            authorizationParams: {
                redirect_uri: `${window.location.origin}/admin`,
                connection: REQUIRED_AUTH0_CONNECTION,
                prompt: "select_account",
            },
        });
    };

    const handleSignOut = () => {
        setProjects([]);
        logout({
            logoutParams: {
                returnTo: `${window.location.origin}/admin`,
            },
        });
    };

    const openCreateModal = () => {
        const maxOrder = projects.reduce((max, p) => {
            const val = Number(p.display_order);
            return Number.isFinite(val) && val > max ? val : max;
        }, 0);

        setEditingId(null);
        setForm({
            ...EMPTY_FORM,
            isArchitecture: categoryFilter !== "product",
            display_order: String(maxOrder + 1),
        });
        setUrlInput("");
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        const desc = parseDescription(project.description);
        setEditingId(project.id);
        setForm({
            projectName: project.projectName || "",
            isArchitecture: project.isArchitecture ?? true,
            client: project.client || "",
            location: project.location || "",
            year: project.year != null ? String(project.year) : "",
            display_order:
                project.display_order != null ? String(project.display_order) : "",
            imageYPosition: Number(project.imageYPosition) || 0,
            tagsText: Array.isArray(project.tags) ? project.tags.join(", ") : "",
            descriptionTr: desc.tr,
            descriptionEn: desc.en,
            projectPictureUrl: Array.isArray(project.projectPictureUrl)
                ? [...project.projectPictureUrl]
                : [],
        });
        setUrlInput("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleAddUrls = () => {
        const parsed = urlInput
            .split(/[\n,]+/)
            .map((u) => u.trim())
            .filter(Boolean);

        if (parsed.length === 0) return;

        const invalid = parsed.find((u) => !/^https?:\/\/.+/i.test(u));
        if (invalid) {
            showToast("error", "Please enter valid http(s) Cloudinary image URLs.");
            return;
        }

        setForm((prev) => ({
            ...prev,
            projectPictureUrl: [...prev.projectPictureUrl, ...parsed],
        }));
        setUrlInput("");
    };

    const handleCloudinaryUpload = async (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        if (!CLOUDINARY_UPLOAD_PRESET) {
            showToast(
                "error",
                "Set VITE_CLOUDINARY_UPLOAD_PRESET in .env to enable direct uploads, or paste Cloudinary URLs below."
            );
            event.target.value = "";
            return;
        }

        setIsUploading(true);
        const uploadedUrls = [];

        try {
            for (const file of files) {
                const body = new FormData();
                body.append("file", file);
                body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                    { method: "POST", body }
                );
                const payload = await res.json();

                if (!res.ok || !payload.secure_url) {
                    throw new Error(payload.error?.message || "Cloudinary upload failed");
                }
                uploadedUrls.push(payload.secure_url);
            }

            setForm((prev) => ({
                ...prev,
                projectPictureUrl: [...prev.projectPictureUrl, ...uploadedUrls],
            }));
            showToast(
                "success",
                `Uploaded ${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""} to Cloudinary.`
            );
        } catch (err) {
            showToast("error", err.message || "Cloudinary upload failed.");
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    const moveImage = (index, direction) => {
        setForm((prev) => {
            const list = [...prev.projectPictureUrl];
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= list.length) return prev;
            [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
            return { ...prev, projectPictureUrl: list };
        });
    };

    const setAsCover = (index) => {
        if (index === 0) return;
        setForm((prev) => {
            const list = [...prev.projectPictureUrl];
            const [picked] = list.splice(index, 1);
            return { ...prev, projectPictureUrl: [picked, ...list] };
        });
    };

    const removeImage = (index) => {
        setForm((prev) => ({
            ...prev,
            projectPictureUrl: prev.projectPictureUrl.filter((_, i) => i !== index),
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.projectName.trim()) {
            showToast("error", "Project name is required.");
            return;
        }

        setIsSaving(true);

        const parsedOrder =
            form.display_order.trim() === "" ? null : Number(form.display_order);
        const tags = form.tagsText
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        const hasDescription =
            form.descriptionTr.trim() || form.descriptionEn.trim();

        const payload = {
            projectName: form.projectName.trim(),
            isArchitecture: Boolean(form.isArchitecture),
            client: form.client.trim() || null,
            location: form.location.trim() || null,
            year: form.year.trim() || null,
            display_order: Number.isFinite(parsedOrder) ? parsedOrder : null,
            imageYPosition: Number(form.imageYPosition) || 0,
            tags,
            description: hasDescription
                ? {
                      "Türkçe": form.descriptionTr.trim(),
                      English: form.descriptionEn.trim(),
                  }
                : null,
            projectPictureUrl: form.projectPictureUrl,
        };

        const { error } = editingId
            ? await dbClient
                  .from("cadance_projects")
                  .update(payload)
                  .eq("id", editingId)
            : await dbClient.from("cadance_projects").insert([payload]);

        setIsSaving(false);

        if (error) {
            showToast("error", `Save failed: ${error.message}`);
            return;
        }

        showToast(
            "success",
            editingId ? "Project updated." : "Project added to portfolio."
        );
        closeModal();
        fetchProjects();
    };

    const handleDelete = async (project) => {
        const confirmed = window.confirm(
            `Delete "${project.projectName}"? This cannot be undone.`
        );
        if (!confirmed) return;

        setDeletingId(project.id);
        const { error } = await dbClient
            .from("cadance_projects")
            .delete()
            .eq("id", project.id);
        setDeletingId(null);

        if (error) {
            showToast("error", `Delete failed: ${error.message}`);
            return;
        }

        setProjects((prev) => prev.filter((p) => p.id !== project.id));
        showToast("success", `"${project.projectName}" deleted.`);
    };

    const filteredProjects = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return projects.filter((p) => {
            if (categoryFilter === "architecture" && !p.isArchitecture) return false;
            if (categoryFilter === "product" && p.isArchitecture) return false;
            if (!q) return true;
            const haystack = [
                p.projectName,
                p.client,
                p.location,
                p.year,
                ...(Array.isArray(p.tags) ? p.tags : []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [projects, categoryFilter, searchQuery]);

    const isSearchActive = searchQuery.trim().length > 0;
    const canDragReorder = !isSearchActive && !isReordering && filteredProjects.length > 1;

    const handleDragStart = (e, projectId) => {
        if (!canDragReorder) return;
        setDraggedId(projectId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(projectId));
    };

    const handleDragOver = (e, targetId) => {
        if (!canDragReorder || draggedId === null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOverId !== targetId) {
            setDragOverId(targetId);
        }
    };

    const handleDragEnd = () => {
        setDraggedId(null);
        setDragOverId(null);
    };

    const handleDrop = async (e, targetId) => {
        e.preventDefault();
        const sourceId = draggedId;
        setDraggedId(null);
        setDragOverId(null);

        if (!canDragReorder || sourceId === null || sourceId === targetId) return;

        const visibleList = [...filteredProjects];
        const fromIdx = visibleList.findIndex((p) => p.id === sourceId);
        const toIdx = visibleList.findIndex((p) => p.id === targetId);
        if (fromIdx === -1 || toIdx === -1) return;

        const [moved] = visibleList.splice(fromIdx, 1);
        visibleList.splice(toIdx, 0, moved);

        // Assign sequential display_order (1..N) across the reordered list
        const updatedOrders = new Map();
        const changedRows = [];
        visibleList.forEach((item, index) => {
            const nextOrder = index + 1;
            updatedOrders.set(item.id, nextOrder);
            if (item.display_order !== nextOrder) {
                changedRows.push({ id: item.id, display_order: nextOrder });
            }
        });

        if (changedRows.length === 0) return;

        // Optimistically update local state sorted by display_order then id
        setProjects((prev) =>
            prev
                .map((p) =>
                    updatedOrders.has(p.id)
                        ? { ...p, display_order: updatedOrders.get(p.id) }
                        : p
                )
                .sort((a, b) => {
                    const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER;
                    const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER;
                    if (orderA !== orderB) return orderA - orderB;
                    return a.id - b.id;
                })
        );

        setIsReordering(true);
        const results = await Promise.all(
            changedRows.map(({ id, display_order }) =>
                dbClient
                    .from("cadance_projects")
                    .update({ display_order })
                    .eq("id", id)
            )
        );
        setIsReordering(false);

        const failed = results.find((r) => r.error);
        if (failed) {
            showToast("error", `Failed to save order: ${failed.error.message}`);
            fetchProjects();
            return;
        }

        showToast("success", "Display order updated.");
    };

    const helmetMeta = (
        <Helmet>
            <title>Admin | Cadance Studio</title>
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
    );

    if (authLoading) {
        return (
            <div className={styles.authShell}>
                {helmetMeta}
                <div className={styles.authCard}>
                    <img src={logo} alt="Cadance" className={styles.authLogo} />
                    <p className={styles.mutedText}>Checking session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.authShell}>
                {helmetMeta}
                <div className={styles.authCard}>
                    <img src={logo} alt="Cadance" className={styles.authLogo} />
                    <h1 className={styles.authTitle}>CADANCE ADMIN</h1>
                    <p className={styles.mutedText}>
                        Sign in with an authorized Google account to manage portfolio
                        projects.
                    </p>
                    {authError && (
                        <p className={styles.errorBanner}>{authError.message}</p>
                    )}
                    <button
                        type="button"
                        className={styles.googleBtn}
                        onClick={handleAuth0SignIn}
                    >
                        <FaGoogle />
                        <span>Continue with Google</span>
                    </button>
                    <Link to="/" className={styles.backLink}>
                        <FaArrowLeft /> Back to website
                    </Link>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        const denyReason = !isGoogleConnection
            ? "Only Google sign-in is permitted."
            : !isEmailVerified
            ? "Your Google email address must be verified."
            : "This account is not authorized to access the admin panel.";

        return (
            <div className={styles.authShell}>
                {helmetMeta}
                <div className={styles.authCard}>
                    <img src={logo} alt="Cadance" className={styles.authLogo} />
                    <h1 className={styles.authTitle}>ACCESS DENIED</h1>
                    <p className={styles.mutedText}>
                        <strong>{user?.email || "Your account"}</strong> cannot access
                        the admin panel. {denyReason}
                    </p>
                    <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={handleSignOut}
                    >
                        <FaRightFromBracket />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminPage}>
            {helmetMeta}

            {toast && (
                <div
                    role="status"
                    className={`${styles.toast} ${
                        toast.type === "error" ? styles.toastError : styles.toastSuccess
                    }`}
                >
                    <span>{toast.text}</span>
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => setToast(null)}
                        aria-label="Dismiss notification"
                    >
                        <FaXmark />
                    </button>
                </div>
            )}

            <header className={styles.topBar}>
                <div className={styles.brandGroup}>
                    <img src={logo} alt="Cadance" className={styles.topLogo} />
                    <div>
                        <h1 className={styles.pageTitle}>Portfolio Admin</h1>
                        <p className={styles.userEmail}>{user?.email || user?.name}</p>
                    </div>
                </div>

                <div className={styles.topActions}>
                    <Link to="/portfolio" className={styles.secondaryBtn}>
                        View Portfolio
                    </Link>
                    <button
                        type="button"
                        className={styles.primaryBtn}
                        onClick={openCreateModal}
                    >
                        <FaPlus />
                        <span>New Project</span>
                    </button>
                    <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={handleSignOut}
                        title="Sign out"
                    >
                        <FaRightFromBracket />
                        <span>Sign Out</span>
                    </button>
                </div>
            </header>

            <main className={styles.content}>
                <div className={styles.toolbar}>
                    <div className={styles.tabs} role="tablist" aria-label="Category filter">
                        {[
                            { key: "all", label: `All (${projects.length})` },
                            {
                                key: "architecture",
                                label: `Architecture (${
                                    projects.filter((p) => p.isArchitecture).length
                                })`,
                            },
                            {
                                key: "product",
                                label: `Product (${
                                    projects.filter((p) => !p.isArchitecture).length
                                })`,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                aria-selected={categoryFilter === tab.key}
                                className={`${styles.tabBtn} ${
                                    categoryFilter === tab.key ? styles.tabActive : ""
                                }`}
                                onClick={() => setCategoryFilter(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <input
                        type="search"
                        className={styles.searchInput}
                        placeholder="Search name, client, location, tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.reorderHint}>
                    <span>
                        {isSearchActive
                            ? "Clear search to drag and reorder projects."
                            : "Drag and drop cards to automatically update display order."}
                    </span>
                    {isReordering && (
                        <span className={styles.reorderSaving}>Saving order...</span>
                    )}
                </div>

                {loadingProjects ? (
                    <div className={styles.emptyState}>Loading projects...</div>
                ) : filteredProjects.length === 0 ? (
                    <div className={styles.emptyState}>
                        No projects found. Click <strong>New Project</strong> to add one.
                    </div>
                ) : (
                    <div className={styles.projectGrid}>
                        {filteredProjects.map((project) => {
                            const cover = project.projectPictureUrl?.[0];
                            const imageCount = Array.isArray(project.projectPictureUrl)
                                ? project.projectPictureUrl.length
                                : 0;
                            const isDragging = draggedId === project.id;
                            const isDragOver =
                                dragOverId === project.id && draggedId !== project.id;

                            return (
                                <article
                                    key={project.id}
                                    draggable={canDragReorder}
                                    onDragStart={(e) => handleDragStart(e, project.id)}
                                    onDragOver={(e) => handleDragOver(e, project.id)}
                                    onDrop={(e) => handleDrop(e, project.id)}
                                    onDragEnd={handleDragEnd}
                                    className={`${styles.projectCard} ${
                                        canDragReorder ? styles.cardDraggable : ""
                                    } ${isDragging ? styles.cardDragging : ""} ${
                                        isDragOver ? styles.cardDragOver : ""
                                    }`}
                                >
                                    <div className={styles.cardThumb}>
                                        {cover ? (
                                            <img
                                                src={cover}
                                                alt={project.projectName || "Project"}
                                                draggable={false}
                                                style={{
                                                    transform: `translateY(${
                                                        project.imageYPosition || 0
                                                    }%)`,
                                                }}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className={styles.noThumb}>No cover</span>
                                        )}
                                        <span className={styles.orderBadge}>
                                            #{project.display_order ?? "—"}
                                        </span>
                                        {canDragReorder && (
                                            <span
                                                className={styles.dragHandle}
                                                aria-hidden="true"
                                                title="Drag to reorder"
                                            >
                                                <FaGripVertical />
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.cardHeader}>
                                            <h2 className={styles.cardTitle}>
                                                {project.projectName}
                                            </h2>
                                            <span
                                                className={`${styles.catBadge} ${
                                                    project.isArchitecture
                                                        ? styles.catArch
                                                        : styles.catProd
                                                }`}
                                            >
                                                {project.isArchitecture
                                                    ? "Architecture"
                                                    : "Product"}
                                            </span>
                                        </div>

                                        <p className={styles.cardMeta}>
                                            {[project.client, project.location, project.year]
                                                .filter(Boolean)
                                                .join(" · ") || "No metadata"}
                                        </p>

                                        <div className={styles.cardFooter}>
                                            <span className={styles.imageCount}>
                                                {imageCount} image{imageCount === 1 ? "" : "s"}
                                            </span>
                                            <div className={styles.cardActions}>
                                                <button
                                                    type="button"
                                                    className={styles.secondaryBtnSmall}
                                                    onClick={() => openEditModal(project)}
                                                >
                                                    <FaPen /> Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.dangerBtnSmall}
                                                    disabled={deletingId === project.id}
                                                    onClick={() => handleDelete(project)}
                                                >
                                                    <FaTrash />
                                                    {deletingId === project.id
                                                        ? "..."
                                                        : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>

            <dialog
                ref={dialogRef}
                className={styles.modalDialog}
                onCancel={(e) => {
                    e.preventDefault();
                    closeModal();
                }}
                onClick={(e) => {
                    if (e.target === dialogRef.current) closeModal();
                }}
            >
                <form className={styles.modalForm} onSubmit={handleSave}>
                    <div className={styles.modalHeader}>
                        <h2>{editingId ? "Edit Project" : "New Project"}</h2>
                        <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={closeModal}
                            aria-label="Close modal"
                        >
                            <FaXmark />
                        </button>
                    </div>

                    <div className={styles.modalBody}>
                        <div className={styles.fieldGrid}>
                            <label className={styles.field}>
                                <span>Project Name *</span>
                                <input
                                    type="text"
                                    required
                                    value={form.projectName}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            projectName: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g. Urla Villa Renovation"
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Category</span>
                                <select
                                    value={
                                        form.isArchitecture ? "architecture" : "product"
                                    }
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            isArchitecture:
                                                e.target.value === "architecture",
                                        }))
                                    }
                                >
                                    <option value="architecture">Architecture</option>
                                    <option value="product">Product Design</option>
                                </select>
                            </label>

                            <label className={styles.field}>
                                <span>Client</span>
                                <input
                                    type="text"
                                    value={form.client}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, client: e.target.value }))
                                    }
                                    placeholder="Client name"
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Location</span>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            location: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g. Izmir, TR"
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Year</span>
                                <input
                                    type="text"
                                    value={form.year}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, year: e.target.value }))
                                    }
                                    placeholder="2026"
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Display Order</span>
                                <input
                                    type="number"
                                    value={form.display_order}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            display_order: e.target.value,
                                        }))
                                    }
                                    placeholder="1"
                                />
                            </label>
                        </div>

                        <label className={styles.field}>
                            <span>Tags (comma-separated)</span>
                            <input
                                type="text"
                                value={form.tagsText}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, tagsText: e.target.value }))
                                }
                                placeholder="villa, interior, renovation, izmir"
                            />
                        </label>

                        <div className={styles.fieldGrid}>
                            <label className={styles.field}>
                                <span>Description (Türkçe)</span>
                                <textarea
                                    rows={4}
                                    value={form.descriptionTr}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            descriptionTr: e.target.value,
                                        }))
                                    }
                                    placeholder="Türkçe proje açıklaması..."
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Description (English)</span>
                                <textarea
                                    rows={4}
                                    value={form.descriptionEn}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            descriptionEn: e.target.value,
                                        }))
                                    }
                                    placeholder="English project description..."
                                />
                            </label>
                        </div>

                        {/* Cloudinary Images Section */}
                        <div className={styles.mediaSection}>
                            <div className={styles.mediaHeader}>
                                <h3>Cloudinary Images</h3>
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={handleCloudinaryUpload}
                                    />
                                    <button
                                        type="button"
                                        className={styles.secondaryBtnSmall}
                                        disabled={isUploading}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FaCloudArrowUp />
                                        {isUploading
                                            ? "Uploading..."
                                            : "Upload to Cloudinary"}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.urlPasteRow}>
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddUrls();
                                        }
                                    }}
                                    placeholder="Paste Cloudinary image URL (https://res.cloudinary.com/...)"
                                />
                                <button
                                    type="button"
                                    className={styles.secondaryBtnSmall}
                                    onClick={handleAddUrls}
                                >
                                    Add URL
                                </button>
                            </div>

                            {form.projectPictureUrl.length > 0 && (
                                <>
                                    <div className={styles.cropPreviewBox}>
                                        <div className={styles.cropControls}>
                                            <span>
                                                Portfolio Cover Y-Offset:{" "}
                                                <strong>{form.imageYPosition}%</strong>
                                            </span>
                                            <input
                                                type="range"
                                                min={-50}
                                                max={50}
                                                value={form.imageYPosition}
                                                onChange={(e) =>
                                                    setForm((p) => ({
                                                        ...p,
                                                        imageYPosition: Number(
                                                            e.target.value
                                                        ),
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className={styles.cropPreviewFrame}>
                                            <img
                                                src={form.projectPictureUrl[0]}
                                                alt="Cover preview"
                                                style={{
                                                    transform: `translateY(${form.imageYPosition}%)`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <ul className={styles.imageList}>
                                        {form.projectPictureUrl.map((url, idx) => (
                                            <li
                                                key={`${url}-${idx}`}
                                                className={styles.imageListItem}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Slide ${idx + 1}`}
                                                    className={styles.imageListThumb}
                                                />
                                                <div className={styles.imageListInfo}>
                                                    {idx === 0 && (
                                                        <span className={styles.coverPill}>
                                                            Cover
                                                        </span>
                                                    )}
                                                    <span
                                                        className={styles.imageUrlText}
                                                        title={url}
                                                    >
                                                        {url}
                                                    </span>
                                                </div>
                                                <div className={styles.imageListActions}>
                                                    {idx > 0 && (
                                                        <button
                                                            type="button"
                                                            className={styles.iconBtn}
                                                            onClick={() => setAsCover(idx)}
                                                            title="Set as cover"
                                                            aria-label="Set as cover"
                                                        >
                                                            <FaStar />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className={styles.iconBtn}
                                                        disabled={idx === 0}
                                                        onClick={() => moveImage(idx, -1)}
                                                        title="Move up"
                                                        aria-label="Move up"
                                                    >
                                                        <FaArrowUp />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={styles.iconBtn}
                                                        disabled={
                                                            idx ===
                                                            form.projectPictureUrl
                                                                .length -
                                                                1
                                                        }
                                                        onClick={() => moveImage(idx, 1)}
                                                        title="Move down"
                                                        aria-label="Move down"
                                                    >
                                                        <FaArrowDown />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                                                        onClick={() => removeImage(idx)}
                                                        title="Remove image"
                                                        aria-label="Remove image"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.primaryBtn}
                            disabled={isSaving || isUploading}
                        >
                            {isSaving
                                ? "Saving..."
                                : editingId
                                ? "Save Changes"
                                : "Create Project"}
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
};

const Admin = () => {
    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
        return (
            <div className={styles.authShell}>
                <Helmet>
                    <title>Admin | Cadance Studio</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <div className={styles.authCard}>
                    <img src={logo} alt="Cadance" className={styles.authLogo} />
                    <h1 className={styles.authTitle}>AUTH0 NOT CONFIGURED</h1>
                    <p className={styles.mutedText}>
                        Add <code>VITE_AUTH0_DOMAIN</code> and{" "}
                        <code>VITE_AUTH0_CLIENT_ID</code> to your <code>.env</code> file
                        to enable admin sign-in.
                    </p>
                    <Link to="/" className={styles.backLink}>
                        <FaArrowLeft /> Back to website
                    </Link>
                </div>
            </div>
        );
    }

    const authorizationParams = {
        redirect_uri: `${window.location.origin}/admin`,
        ...(AUTH0_AUDIENCE ? { audience: AUTH0_AUDIENCE } : {}),
    };

    return (
        <Auth0Provider
            domain={AUTH0_DOMAIN}
            clientId={AUTH0_CLIENT_ID}
            authorizationParams={authorizationParams}
            cacheLocation="localstorage"
            onRedirectCallback={() => {
                window.history.replaceState({}, document.title, "/admin");
            }}
        >
            <AdminDashboard />
        </Auth0Provider>
    );
};

export default Admin;

