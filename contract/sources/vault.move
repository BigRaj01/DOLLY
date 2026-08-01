module dolly::vault {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::event;

    /// A single document clone: one version of a file, optionally linked to a parent clone.
    struct Clone has store, copy, drop {
        /// Shelby blob commitment hash for this clone's content
        content_hash: String,
        /// content_hash of the clone this one revises, empty string if it's the origin
        parent_hash: String,
        /// user-facing filename, e.g. "final-signed.pdf"
        name: String,
        anchored_at: u64,
    }

    /// One vault per wallet, holding every clone that wallet has anchored.
    struct Vault has key {
        clones: vector<Clone>,
    }

    #[event]
    struct CloneAnchored has drop, store {
        owner: address,
        content_hash: String,
        parent_hash: String,
        anchored_at: u64,
    }

    const E_VAULT_NOT_FOUND: u64 = 1;
    const E_DUPLICATE_HASH: u64 = 2;

    /// Create an empty vault for the caller. Call once before anchoring the first clone.
    public entry fun init_vault(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<Vault>(addr)) {
            move_to(account, Vault { clones: vector::empty<Clone>() });
        }
    }

    /// Anchor a new clone. `parent_hash` should be an empty string for an origin document.
    public entry fun anchor_clone(
        account: &signer,
        content_hash: String,
        parent_hash: String,
        name: String,
    ) acquires Vault {
        let addr = signer::address_of(account);
        assert!(exists<Vault>(addr), E_VAULT_NOT_FOUND);

        let vault = borrow_global_mut<Vault>(addr);
        let i = 0;
        let len = vector::length(&vault.clones);
        while (i < len) {
            let existing = vector::borrow(&vault.clones, i);
            assert!(existing.content_hash != content_hash, E_DUPLICATE_HASH);
            i = i + 1;
        };

        let anchored_at = timestamp::now_seconds();
        vector::push_back(&mut vault.clones, Clone {
            content_hash,
            parent_hash,
            name,
            anchored_at,
        });

        event::emit(CloneAnchored { owner: addr, content_hash, parent_hash, anchored_at });
    }

    #[view]
    /// Return every clone in `owner`'s vault, in anchor order (oldest first).
    public fun get_lineage(owner: address): vector<Clone> acquires Vault {
        assert!(exists<Vault>(owner), E_VAULT_NOT_FOUND);
        borrow_global<Vault>(owner).clones
    }

    #[view]
    public fun clone_count(owner: address): u64 acquires Vault {
        if (!exists<Vault>(owner)) return 0;
        vector::length(&borrow_global<Vault>(owner).clones)
    }
}
