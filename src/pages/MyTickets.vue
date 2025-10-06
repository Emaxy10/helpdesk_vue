<template>
  <v-card class="pa-4 rounded-lg elevation-2">
    <v-card-title class="text-h6 font-weight-bold">
      🎟 My Tickets
    </v-card-title>

    <!-- Tickets Table -->
    <v-data-table
      :headers="headers"
      :items="tickets"
      class="elevation-1 mt-4"
      item-value="id"
      dense
    >
      <!-- Agent -->
      <template v-slot:item.agent="{ item }">
        <span v-if="item.agent">{{ item.agent.name }}</span>
        <span v-else class="text-grey">Unassigned</span>
      </template>

      <!-- Status -->
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="item.status === 'open' ? 'blue' : 'green'"
          size="small"
          class="text-white"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Actions -->
      <template v-slot:item.actions="{ item }">
        <v-tooltip text="See & Add Comments">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              color="indigo"
              @click="openComments(item)"
            >
              <v-icon>mdi-comment-eye</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>

    <!-- Comments Dialog -->
    <v-dialog v-model="showComments" max-width="650">
      <v-card rounded="xl">
        <v-card-title class="font-weight-bold">
          💬 Comments for: {{ selectedTicket?.title }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <!-- Loader -->
          <div v-if="loadingComments" class="text-center pa-4">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <!-- Comments List -->
          <div v-else>
            <div v-if="comments.length">
              <v-list>
                <v-list-item
                  v-for="comment in comments"
                  :key="comment.id"
                  class="border-b py-2"
                >
                  <v-list-item-title>  {{ comment.user?.name || 'Unknown User' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ comment.comment }}</v-list-item-subtitle>
                  <small class="text-grey">
                    {{ new Date(comment.created_at).toLocaleString() }}
                  </small>
                </v-list-item>
              </v-list>
            </div>
            <div v-else class="text-grey text-center my-4">
              No comments yet.
            </div>

            <!-- Add Comment -->
            <v-divider class="my-3"></v-divider>

            <v-textarea
              v-model="newComment"
              label="Add a comment..."
              auto-grow
              rows="2"
              variant="outlined"
              clearable
            ></v-textarea>

            <v-btn
              color="primary"
              block
              class="mt-2"
              :disabled="!newComment.trim() || submitting"
              @click="postComment"
            >
              <v-icon start>mdi-send</v-icon>
              {{ submitting ? 'Posting...' : 'Post Comment' }}
            </v-btn>
          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="error" text @click="showComments = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { useRouter } from 'vue-router';

const tickets = ref([]);
const showComments = ref(false);
const selectedTicket = ref(null);
const comments = ref([]);
const loadingComments = ref(false);
const newComment = ref('');
const submitting = ref(false);
const router = useRouter();

const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Priority', key: 'priority' },
  { title: 'Status', key: 'status' },
  { title: 'Agent', key: 'agent' },
  {   title: 'Created At',
  key: 'created_at',
  value: (item) => new Date(item.created_at).toLocaleString(), },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Fetch user tickets
const getTickets = async () => {
  try {
    const response = await api.get('/ticket/my');
    tickets.value = response.data;
    
  } catch (error) {
    // if(error.response.status === 401){
    //     alert("Login to continue")
    //     router.push('/login')
    // }
    console.error('Error fetching tickets:', error);
  }
};

// Open comments modal and fetch
const openComments = async (ticket) => {
  selectedTicket.value = ticket;
  showComments.value = true;
  loadingComments.value = true;
  comments.value = [];

  try {
    const response = await api.get(`/tickets/${ticket.id}/comments`);
    comments.value = response.data.comments || [];

    console.log(comments.value)

  } catch (error) {
    console.error('Error loading comments:', error);
  } finally {
    loadingComments.value = false;
  }
};

// Post new comment
const postComment = async () => {
  if (!newComment.value.trim()) return;

  submitting.value = true;
  try {
    const response = await api.post(`/tickets/${selectedTicket.value.id}/comments`, {
      comment: newComment.value,
    });
    comments.value.unshift(response.data.comment); // Add new comment to top
    newComment.value = '';
  } catch (error) {
    console.error('Error posting comment:', error);
  } finally {
    submitting.value = false;
  }
};



onMounted(getTickets);
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid #eee;
}
</style>
