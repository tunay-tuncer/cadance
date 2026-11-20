import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import supabaseClient from "../config/supabaseClient";
import styles from "../styles/Admin.module.css";
import logo from "../assets/LogoBluePNG.png";
import {
    FaArrowDown,
    FaArrowLeft,
    FaArrowUp,
    FaCloudArrowUp,
    FaGoogle,
    FaPen,
    FaPlus,
    FaRightFromBracket,
    FaStar,
    FaTrash,
    FaXmark,
} from "react-icons/fa6";

const CLOUDINARY_CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dabmjz0xr";
const CLOUDINARY_UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const ALLOWED_ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

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

const Admin = () => {
    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState("");

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

    // Sync Supabase Auth session
    useEffect(() => {
        let mounted = true;

        supabaseClient.auth.getSession().then(({ data, error }) => {
            if (!mounted) return;
            if (error) {
                setAuthError(error.message);
            }
            setSession(data?.session ?? null);
            setAuthLoading(false);
        });

        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
            if (!mounted) return;
            setSession(nextSession);
            setAuthLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const userEmail = session?.user?.email?.toLowerCase() || "";
    const isAuthorized = useMemo(() => {
        if (!session) return false;
        if (ALLOWED_ADMIN_EMAILS.length === 0) return true;
        return ALLOWED_ADMIN_EMAILS.includes(userEmail);
    }, [session, userEmail]);

    const fetchProjects = useCallback(async () => {
        setLoadingProjects(true);
        const { data, error } = await supabaseClient
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
    }, [showToast]);

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

    const handleGoogleSignIn = async () => {
        setAuthError("");
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/admin`,
                queryParams: {
                    prompt: "select_account",
                },
            },
        });
        if (error) {
            setAuthError(error.message);
        }
    };

    const handleSignOut = async () => {
        await supabaseClient.auth.signOut();
        setProjects([]);
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
            ? await supabaseClient
                  .from("cadance_projects")
                  .update(payload)
                  .eq("id", editingId)
            : await supabaseClient.from("cadance_projects").insert([payload]);

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
        const { error } = await supabaseClient
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

    if (!session) {
        return (
            <div className={styles.authShell}>
                {helmetMeta}
                <div className={styles.authCard}>
                    <img src={logo} alt="Cadance" className={styles.authLogo} />
                    <h1 className={styles.authTitle}>CADANCE ADMIN</h1>
                    <p className={styles.mutedText}>
                        Sign in with an authorized Gmail account to manage portfolio
                        projects.
                    </p>
                    {authError && <p className={styles.errorBanner}>{authError}</p>}
                    <button
                        type="button"
                        className={styles.googleBtn}
                        onClick={handleGoogleSignIn}
                    >
                        <FaGoogle />
                        <span>Continue with Gmail</span>
                    </button>
                    <Link to="/" className={styles.backLink}>
                        <FaArrowLeft /> Back to website
                    </Link>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className={styles.authShell}>
                {helmetMeta}
                <div className={styles.authCard}>
                    <img src={logo} alt="Cadance" className={styles.authLogo} />
                    <h1 className={styles.authTitle}>ACCESS DENIED</h1>
                    <p className={styles.mutedText}>
                        <strong>{session.user.email}</strong> is not in the admin
                        allowlist.
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
                        <p className={styles.userEmail}>{session.user.email}</p>
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

                            return (
                                <article key={project.id} className={styles.projectCard}>
                                    <div className={styles.cardThumb}>
                                        {cover ? (
                                            <img
                                                src={cover}
                                                alt={project.projectName || "Project"}
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

export default Admin;

