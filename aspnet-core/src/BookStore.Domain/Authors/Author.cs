using System;
using JetBrains.Annotations;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace BookStore.Authors
{
    public class Author : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public string ShortBio { get; set; }

        public Author()
        {
        }

        internal Author(
            Guid id,
            [NotNull] string name,
            DateTime birthDate,
            [CanBeNull] string shortBio = null
            ) : base(id)
        {
            SetName(name);
            BirthDate = birthDate;
            shortBio = shortBio;
        }

        internal Author ChangeName([NotNull] string name)
        {
            SetName(name);
            return this;
        }

        private void SetName([NotNull] string name)
        {
            Name = Check.NotNullOrWhiteSpace(
                name,
                nameof(name),
                maxLength: AuthorConsts.MaxNameLength
                );
        }
    }
}

